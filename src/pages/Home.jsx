import axios from "axios";
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
// DISEÑO
import { Button, Dropdown, Menu, Space, Modal, Tag, Row, Col } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { Chart } from "@antv/g2";

// COMPONENTES
import DataComponent from "../components/DataComponent";
import AumentarVida from "../components/AumentarVida";
import AumentarFelicidad from "../components/AumentarFelicidad";
import Revivir from "../components/Revivir";
// CSS
import "./css/Home.css";

const Home = () => {
  const { user, logout, isAuthenticated } = useAuth0();
  const gifRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [data, setData] = useState({});
  const [estado, setEstado] = useState("Estado normal");
  const [activeComponent, setActiveComponent] = useState(null);

  const handleLogout = () => logout({ returnTo: window.location.origin });

  const handleResize = () => {
    if (gifRef.current) {
      setChartWidth(gifRef.current.clientWidth);
    }
  };

  useLayoutEffect(() => handleResize(), []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    const progress = data.puntosVida ? data.puntosVida / 100 : 1;
    const chart = new Chart({
      container: "chart-container",
      autoFit: false,
      width: chartWidth,
      height: 60,
      padding: 0,
    });
    chart.coordinate({ transform: [{ type: "transpose" }] });
    chart
      .interval()
      .data([1, progress])
      .encode("y", (d) => d)
      .encode("color", (d, idx) => idx)
      .scale("y", { domain: [0, 1] })
      .scale("color", { range: ["#000000", "#a0ff03"] })
      .legend(false)
      .axis(false);
    chart.text().style({
      text: `${Math.round(progress * 100)}%`,
      x: "50%",
      y: "50%",
      textAlign: "center",
      fontSize: 16,
      fontStyle: "bold",
    });
    chart.interaction("tooltip", false);
    chart.render();
    handleResize();

    return () => {
      chart.destroy();
      window.removeEventListener("resize", handleResize);
    };
  }, [chartWidth, data]);

 // RENDERIZADO CHARTS
  const renderStatChart = (containerId, value, label) => {
    const determineColor = (value) => {
      if (value > 50) return "#a0ff03"; // Verde
      if (value >= 11) return "#FFA500"; // Naranja
      return "#FF0000"; // Rojo
    };
  
    const statChart = new Chart({
      container: containerId,
      autoFit: true,
      width: 100,
      height: 100,
    });
  
    const color = determineColor(value);
  
    statChart.coordinate({ type: "theta", innerRadius: 0.7 });
    statChart
      .interval()
      .data([1, value / 100])
      .encode("y", (d) => d)
      .encode("color", (d, idx) => idx)
      .scale("y", { domain: [0, 1] })
      .scale("color", { range: ["#000000", color] }) // Aplica color dinámico
      .axis(false)
      .legend(false);
  
    statChart.text().style({
      text: `${Math.round(value)}%`,
      x: "50%",
      y: "50%",
      textAlign: "center",
      fontSize: 13,
      fontStyle: "bold",
      fill: color, // Color del texto actualizado a color dinámico
      fontFamily: "'Press Start 2P', cursive", // Fuente actualizada
    });
    
    statChart.interaction("tooltip", false);
    statChart.render();
  };  

// VALORES CHARTS
  useEffect(() => {
    if (data) {
      renderStatChart("chart-water", data.waterAmount, "Agua");
      renderStatChart("chart-food", data.foodAmount, "Comida");
      renderStatChart("chart-happiness", data.happyAmount, "Felicidad");
      renderStatChart("chart-temperature", data.temperature, "Temperatura");
      renderStatChart("chart-humidity", data.humidity, "Humedad");
      renderStatChart("chart-light", data.light, "Luz");
    }
  }, [data]);

  const menu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Cerrar sesión
      </Menu.Item>
    </Menu>
  );

  const handleIniciar = async () => {
    try {
      const response = await axios.get("http://localhost:3001/iniciar?ok=true");
      console.log(response);
    } catch (error) {
      console.error("Error al iniciar:", error);
    }
  };

  const handleReiniciar = async () => {
    try {
      const response = await axios.get("http://localhost:3001/iniciar?ok=false");
      console.log(response);
    } catch (error) {
      console.error("Error al reiniciar:", error);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  return isAuthenticated ? (
    <>
      {/* NAVBAR */}
      <div className="navContainer">
        <div className="buttonPrincipio">
          <button className="buttonBoot" onClick={handleIniciar}>Iniciar</button>
          <button className="buttonBoot" onClick={handleReiniciar}>Reiniciar</button>
        </div>
        <div>
          <span className="userName">{user.name}</span>
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <Button
              className="button"
              shape="circle"
              icon={
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4032/4032999.png"
                  alt="icon"
                  className="icon"
                />
              }
            />
          </Dropdown>
        </div>
      </div>

      <div className="mainContainer">

        {/* CONTAINER ESTADÍSITCAS */}
        <Row gutter={[16, 16]} justify="center" className="statsContainer">
          <Col xs={24} sm={12} md={12} lg={8}>
            <div className="statItem">
              <span>Agua</span>
              <div id="chart-water"></div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8}>
            <div className="statItem">
              <span>Comida</span>
              <div id="chart-food"></div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8}>
            <div className="statItem">
              <span>Felicidad</span>
              <div id="chart-happiness"></div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8}>
            <div className="statItem">
              <span>Temperatura</span>
              <div id="chart-temperature"></div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8}>
            <div className="statItem">
              <span>Humedad</span>
              <div id="chart-humidity"></div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8}>
            <div className="statItem">
              <span>Luz</span>
              <div id="chart-light"></div>
            </div>
          </Col>
        </Row>

        {/* MASCOTA CONTAINER*/}
        <div className="gifContainer">
          <div
            style={{ ...styles.chartContainer, width: chartWidth }}
            id="chart-container"
          ></div>

          {/* WRAPPER */}
          <div className="gifWrapper">
            <img
              ref={gifRef}
              src="https://www.icegif.com/wp-content/uploads/dinosaur-icegif-20.gif"
              alt="GIF"
              className="gif"
              onLoad={handleResize}
            />
          </div>
        </div>

        {/* BOTONES CONTAINER */}
        <div className="buttonsContainer">
          <Space direction="vertical" size="large">
            <Space size="large" wrap>
              <Button className="actionButton" onClick={() => setActiveComponent("AumentarVida")}>Alimentar</Button>
              <Button className="actionButton" onClick={() => setActiveComponent("AumentarFelicidad")}>Aumentar Felicidad</Button>
            </Space>
          </Space>
          <div className="componentContainer">
            {activeComponent === "AumentarVida" && <AumentarVida />}
            {activeComponent === "AumentarFelicidad" && <AumentarFelicidad />}
          </div>
        </div>
      </div>

      {/* ESTADO */}
      <div className="stateContainer">
        <Tag className="tag">{estado}</Tag>
      </div>

      {/* PANEL DE CONTROL */}
      <div className="panelContainer">
        <Button className="buttonPanel" onClick={showModal}>
          Panel de Control
        </Button>
        <Modal
          className="modal"
          title="Panel de Control"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >

          {/* MODAL */}
          <Button className="buttonmodal" onClick={showModal}>
            Matar Mascota
          </Button>
          <Button className="buttonmodal" onClick={() => setActiveComponent("Revivir")}>
            Revivir Mascota
          </Button>
          {activeComponent === "Revivir" && <Revivir />}
        </Modal>
      </div>

      <DataComponent setEstado={setEstado} setData={setData} />
    </>
  ) : (
    <p>No has iniciado sesión</p>
  );
};

const styles = {
  chartContainer: {
    position: "absolute",
    top: "-40px",
    left: "50%",
    transform: "translateX(-50%)",
    height: "60px",
    zIndex: 10,
  },
};

export default Home;
