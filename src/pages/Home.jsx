// COMPONENTES
import DataComponent, { data } from '../components/DataComponent';
import AumentarFelicidad from '../components/AumentarFelicidad';
import AumentarVida from '../components/AumentarVida';
import Revivir from '../components/Revivir';

// REACT
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
// ANT DESIGN
import { Button, Dropdown, Menu, Space, Modal } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
// AUTH0
import { useAuth0 } from '@auth0/auth0-react';
// G2 Chart
import { Chart } from '@antv/g2';
// CSS
import './css/Home.css'; 

const Home = () => {
  const { user, logout, isAuthenticated } = useAuth0();
  const gifRef = useRef(null); 
  const [chartWidth, setChartWidth] = useState(0);

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  const handleResize = () => {
    if (gifRef.current) {
      setChartWidth(gifRef.current.clientWidth); 
    }
  };

  useLayoutEffect(() => {
    handleResize();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    const progress = data ? data.puntosVida / 100 : 1; // Calcular el progreso con puntosVida
    const chart = new Chart({
      container: 'chart-container',
      autoFit: false,
      width: chartWidth,
      height: 60,
      padding: 0,
    });
    chart.coordinate({ transform: [{ type: 'transpose' }] });
    chart
      .interval()
      .data([1, progress])
      .encode('y', (d) => d)
      .encode('color', (d, idx) => idx)
      .scale('y', { domain: [0, 1] })
      .scale('color', { range: ['#000000', '#a0ff03'] })
      .legend(false)
      .axis(false);
    chart.text().style({
      text: `${progress * 100}%`,
      x: '50%',
      y: '50%',
      textAlign: 'center',
      fontSize: 16,
      fontStyle: 'bold',
    });
    chart.interaction('tooltip', false);
    chart.render();
    handleResize();
    return () => {
      chart.destroy();
      window.removeEventListener('resize', handleResize);
    };
  }, [chartWidth, data]); // Agregar data a la dependencia del useEffect

  // NAVBAR
  const menu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Cerrar sesión
      </Menu.Item>
    </Menu>
  );

  // MODAL PANEL DE CONTROL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return isAuthenticated ? (
    <>
      {/* NAVBAR */}
      <div className="navContainer"> 
        <span className="userName">{user.name}</span> 
        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
          <Button
            shape="circle"
            icon={
              <img
                src="https://cdn-icons-png.flaticon.com/512/4032/4032999.png"
                alt="icon"
                className="icon" 
              />
            }
            className="button" 
          />
        </Dropdown>
      </div>

      {/* CONTAINER PRINCIPAL */}
      <div className="mainContainer"> 
        
        {/* BLOQUE ESTADÍSTICA */}
        <div className="statsContainer"> 
          <DataComponent />
        </div>

        {/* BLOQUE GIF */}
        <div className="gifContainer" >

          {/* BARRA DE VIDA */}
          <div style={{ ...styles.chartContainer, width: chartWidth }} id="chart-container">

          </div>

          {/* GIF */}
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
              <Button className="actionButton">Alimentar e Hidratar</Button> 
              <Button className="actionButton">Abanicar</Button> 
              <Button className="actionButton">Acariciar</Button> 
              <Button className="actionButton">Bañar</Button> 
              <Button className="actionButton">Calentar</Button> 
            </Space>
          </Space>
        </div>
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
          <Button className="buttonmodal" onClick={showModal}> 
            Resucitar Mascota
          </Button>
        </Modal>
      </div>
    </>
  ) : (
    <p>No has iniciado sesión</p>
  );
};

// RESIZE DE LA BARRA DE VIDA
const styles = {
  chartContainer: {
    position: 'absolute',
    top: '-40px',
    left: '50%',
    transform: 'translateX(-50%)',
    height: '60px',
    zIndex: 10,
  },
};

export default Home;