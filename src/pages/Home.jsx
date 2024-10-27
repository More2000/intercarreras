import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Button, Dropdown, Menu, Space, Modal, Tag } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { Chart } from "@antv/g2";
import axios from "axios";
import DataComponent from "../components/DataComponent";
import AumentarVida from "../components/AumentarVida";
import AumentarFelicidad from "../components/AumentarFelicidad";
import Revivir from "../components/Revivir";
import "./css/Home.css";

const Home = () => {
  const { user, logout, isAuthenticated } = useAuth0();
  const gifRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [data, setData] = useState({}); // Definimos los hooks aquí
  const [estado, setEstado] = useState("Estado normal");
  const [activeComponent, setActiveComponent] = useState(null); // Nuevo estado

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
      const response = await axios.get(
        "http://localhost:3001/iniciar?ok=false"
      );
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
          <button  onClick={handleReiniciar}>Reiniciar</button>
        </div>

        {/* LOGOUT */}
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

      {/* CONTAINER PRINCIPAL */}
      <div className="mainContainer">

        {/* CONTAINER DE ESTADÍSTICAS*/}
        <div className="statsContainer">
          <ul>
            <li>Cantidad de agua: {data.waterAmount}</li>
            <li>Cantidad de comida: {data.foodAmount}</li>
            <li>Felicidad: {data.happyAmount}</li>
            <li>Temperatura: {data.temperature}</li>
            <li>Humedad: {data.humidity}</li>
            <li>Luz: {data.light}</li>
          </ul>
        </div>

        {/* CONTAINER DE MASCOTA*/}
        <div className="gifContainer">
          
          {/* BARRA DE VIDA */}
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

        {/* BLOQUE BOTONES*/}
        <div className="buttonsContainer"> 
          <Space direction="vertical" size="large"> 
            <Space size="large" wrap>
              <Button className="actionButton" onClick={() => setActiveComponent("AumentarVida")}>Alimentar</Button> 
              <Button className="actionButton" onClick={() => setActiveComponent("AumentarFelicidad")}>Aumentar Felicidad</Button> 
            </Space>
          </Space>
          {/* Renderizar el componente activo */}
         <div className="componentContainer">
            {activeComponent === "AumentarVida" && <AumentarVida />}
            {activeComponent === "AumentarFelicidad" && <AumentarFelicidad />}
            {activeComponent === "Revivir" && <Revivir />}
         </div>
        </div>
      </div>

      {/* TAG ESTADO */}
      <div className='stateContainer'>
        <Tag className='tag'>{estado}</Tag> 
      </div>

      {/* PANEL DE CONTROL */}
      <div className="panelContainer" > 
        <Button className="buttonPanel" onClick={showModal}> 
          Panel de Control
        </Button>
        <Modal className="modal" title="Panel de Control" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}> 
          <Button className="buttonmodal" onClick={showModal}> 
            Matar Mascota
          </Button>
          <Button className="buttonmodal" onClick={() => setActiveComponent("Revivir")}> 
            Resucitar Mascota
          </Button>
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
