import axios from "axios";
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";

// DISEÑO
import {Button,Dropdown,Menu,Space,Modal,Tag,Row,Col,notification,} from "antd";
import { LogoutOutlined, DownOutlined } from "@ant-design/icons";
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

  // HOOKS
  const { user, logout, isAuthenticated } = useAuth0();
  const gifRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [data, setData] = useState({});
  const [estado, setEstado] = useState("Estado normal");
  const [activeComponent, setActiveComponent] = useState(null);
  const gifActual = gifsPorEstado[data.estado] || gifsPorEstado[0];

  // LOGOUT
  const handleLogout = () => logout({ returnTo: window.location.origin });

  // RESIZE DEL GIF
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
      height: 80,
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
  // RANGO DE COLORES SEGUN PORCENTAJE
  const getProgressColor = (progress) => {
    if (progress <= 0.15) return "#FF0000"; // ROJO
    if (progress <= 0.40) return "#FFA500"; // NARANJA
    if (progress <= 0.59) return "#FFFF00"; // AMARILLO
    return "#000000"; // NEGRO
  };
  chart.text().style({
    text: `${Math.round(progress * 100)}%`,
    x: "50%",
    y: "50%",
    textAlign: "center",
    fontSize: 16,
    fontStyle: "bold",
    fill: getProgressColor(progress),
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
      if (value > 50) return "#a0ff03"; 
      if (value >= 11) return "#FFA500";
      return "#FF0000";
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
      .scale("color", { range: ["#000000", color] }) 
      .axis(false)
      .legend(false);

    statChart.text().style({
      text: `${Math.round(value)}%`,
      x: "50%",
      y: "50%",
      textAlign: "center",
      fontSize: 13,
      fontStyle: "bold",
      fill: color,
      fontFamily: "'Press Start 2P', cursive",
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

  // BOTON INICIAR
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

  // BOTON REINICIAR
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

  // KILL PET
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

  // HOOKS MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  // DROPDOWN ALIMENTAR
const dropdownAlimentar = (
  <Menu className="dropdownButton">
    <Menu.Item key="1">
      <AumentarVida />
    </Menu.Item>
  </Menu>
);

// DROPDOWN JUGAR
const dropdownJugar = (
  <Menu className="dropdownButton">
    <Menu.Item key="1">
      <AumentarFelicidad />
    </Menu.Item>
  </Menu>
);

// DROPDOWN REVIVIR
const dropdownRevivir = (
  <Menu className="dropdownButton">
    <Menu.Item key="1">
      <Revivir />
    </Menu.Item>
  </Menu>
);

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
              <Dropdown overlay={dropdownAlimentar} overlayClassName="dropdownButton" trigger={["click"]}>
                <Button className="actionButton">
                  Alimentar <DownOutlined />
                </Button>
              </Dropdown>
              <Dropdown overlay={dropdownJugar} overlayClassName="dropdownButton" trigger={["click"]}>
                <Button className="actionButton">
                  Jugar <DownOutlined />
                </Button>
              </Dropdown>
            </Space>
          </Space>
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
          <Dropdown overlay={dropdownRevivir} overlayClassName="dropdownButton" trigger={["click"]}>
                <Button className="actionButton">
                  Revivir <DownOutlined />
                </Button>
          </Dropdown>
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
    top: "100px",
    left: "50%",
    transform: "translateX(-50%)",
    height: "60px",
    zIndex: 10,
  },
  gif: {
    transform: "scale(2)", // Ajusta el factor de escala según el tamaño deseado
    transformOrigin: "center",
  },
};

export default Home;
