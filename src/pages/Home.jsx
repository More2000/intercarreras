import axios from "axios";
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
// DISEÑO
import {
  Button,
  Dropdown,
  Menu,
  Space,
  Modal,
  Tag,
  Row,
  Col,
  notification,
} from "antd";
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

const gifsPorEstado = {
  0: "../../gifs/normal/normalGIF.gif",
  1: "../../gifs/hambre/HambreGIF.gif",
  2: "../../gifs/calor/CalorGIF.gif",
  3: "../../gifs/triste/TristeGIF.gif",
  4: "../../gifs/calor/CalorGIF.gif",
  5: "../../gifs/sueno/SuenoGIF.gif",
  6: "../../gifs/enojo/EnojoGIF.gif",
  7: "../../gifs/negacion/NegacionGIF.gif",
  8: "../../gifs/muerto/MuertoGIF.gif",
  9: "../../gifs/revivido/revividoGIF.gif",
  0: "../../gifs/normal/normalGIF.gif",
};

const Home = () => {
  const { user, logout, isAuthenticated } = useAuth0();
  const gifRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [data, setData] = useState({});
  const [estado, setEstado] = useState("Estado normal");
  const [activeComponent, setActiveComponent] = useState(null);
  const gifActual = gifsPorEstado[data.estado] || gifsPorEstado[0];

  const handleLogout = () => logout({ returnTo: window.location.origin });
  const handleResize = () => {
    if (gifRef.current) {
      setChartWidth(gifRef.current.clientWidth);
    }
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useLayoutEffect(() => handleResize(), []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    const progress = data.puntosVida ? data.puntosVida / 100 : 0;
    const chart = new Chart({
      container: "chart-container",
      autoFit: false,
      width: chartWidth,
      height: 80, // Cambia de 60 a 80 para aumentar el tamaño
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
      const response = await axios.get(
        "https://life-pub-js.vercel.app/iniciar?ok=true"
      );
      notification.success({
        message: "Iniciado",
        description: "Se ha iniciado el contador de vida",
        duration: 2,
      });
      console.log(response);
    } catch (error) {
      console.error("Error al iniciar:", error);
    }
  };

  const handleReiniciar = async () => {
    try {
      const response = await axios.get(
        "https://life-pub-js.vercel.app/iniciar?ok=false"
      );
      notification.success({
        message: "Reiniciado",
        description:
          "Se ha reiniciado el contador de vida, porfavor inicialo de nuevo!",
        duration: 2,
      });
      console.log(response);
    } catch (error) {
      console.error("Error al reiniciar:", error);
    }
  };
  const handleMatarMascota = async () => {
    try {
      const response = await axios.get(
        "https://life-pub-js.vercel.app/matar?kill=true"
      );
      notification.success({
        message: "Mataste a tu mascota",
        description: "Has matado a tu mascota, porfavor revivela!",
        duration: 2,
      });
      console.log(response);
    } catch (error) {
      console.error("Error al matar:", error);
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
          <button className="buttonBoot" onClick={handleIniciar}>
            Iniciar
          </button>
          <button className="buttonBoot" onClick={handleReiniciar}>
            Reiniciar
          </button>
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
              src={gifActual}
              alt="GIF"
              className="gif"
              onLoad={handleResize}
              style={styles.gif}
            />
          </div>
        </div>

        {/* BOTONES CONTAINER */}
        <div className="buttonsContainer">
          <Space direction="vertical" size="large">
            <Space size="large" wrap>
              <Button
                className="actionButton"
                onClick={() => setActiveComponent("AumentarVida")}
              >
                Alimentar
              </Button>
              <Button
                className="actionButton"
                onClick={() => setActiveComponent("AumentarFelicidad")}
              >
                Jugar
              </Button>
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
          <Button className="buttonmodal" onClick={handleMatarMascota}>
            Matar Mascota
          </Button>
          <Button
            className="buttonmodal"
            onClick={() => setActiveComponent("Revivir")}
          >
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
    top: "120px",
    left: "50%",
    transform: "translateX(-50%)",
    height: "60px",
    zIndex: 10,
  },
};

export default Home;
