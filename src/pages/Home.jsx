import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
// ANT DESIGN
import { Button, Dropdown, Menu, Space, Modal } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
// AUTH0
import { useAuth0 } from '@auth0/auth0-react';
// G2 Chart
import { Chart } from '@antv/g2';
const Home = () => {
  const { user, logout, isAuthenticated } = useAuth0();
  const gifRef = useRef(null); // Usamos useRef para referenciar el GIF
  const [chartWidth, setChartWidth] = useState(0);

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  const handleResize = () => {
    if (gifRef.current) {
      setChartWidth(gifRef.current.clientWidth); // Ajusta el ancho del gráfico al ancho del GIF
    }
  };

  useLayoutEffect(() => {
    handleResize();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    const progress = 1;
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
  }, [chartWidth]);

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
      <div style={styles.navContainer}>
        <span style={styles.userName}>{user.name}</span>
        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
          <Button
            shape="circle"
            icon={
              <img
                src="https://cdn-icons-png.flaticon.com/512/4032/4032999.png"
                alt="icon"
                style={styles.icon}
              />
            }
            style={styles.button}
          />
        </Dropdown>
      </div>

      {/* CONTAINER PRINCIPAL */}
      <div style={styles.mainContainer}>
        
        {/* BLOQUE ESTADÍSTICA */}
        <div style={styles.statsContainer}>
          ESTADÍSTICAS
        </div>

        {/* BLOQUE GIF */}
        <div style={styles.gifContainer}>
          <div style={{ ...styles.chartContainer, width: chartWidth }} id="chart-container"></div>
          <div style={styles.gifWrapper}>
            <img
              ref={gifRef}
              src="https://www.icegif.com/wp-content/uploads/dinosaur-icegif-20.gif"
              alt="GIF"
              style={styles.gif}
              onLoad={handleResize}
            />
          </div>
        </div>

        {/* BLOQUE BOTONES*/}
        <div style={styles.buttonsContainer}>
          <Space direction="vertical" size="large"> 
              <Space size="large" wrap>
              <Button style={styles.rectangleButton}>Alimentar</Button>
              <Button style={styles.rectangleButton}>Hidratar</Button>
              <Button style={styles.rectangleButton}>Abanicar</Button>
              <Button style={styles.rectangleButton}>Acariciar</Button>
              <Button style={styles.rectangleButton}>Bañar</Button>
              <Button style={styles.rectangleButton}>Calentar</Button>
              </Space>
          </Space>
        </div>
      </div>

      {/* PANEL DE CONTROL */}
      <div style={styles.panelContainer}>
        <Button style={styles.buttonPanel} onClick={showModal}>
          Panel de Control
        </Button>
        <Modal style={styles.modal} title="Panel de Control" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Button style={styles.buttonmodal} onClick={showModal}>
          Matar Mascota
        </Button>
        <Button style={styles.buttonmodal} onClick={showModal}>
          Resucitar Mascota
        </Button>
        </Modal>
      </div>
    </>
  ) : (
    <p>No has iniciado sesión</p>
  );
};

const styles = {
  navContainer: {
    position: 'fixed',
    top: '10px',
    right: '20px',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
  },
  userName: {
    marginRight: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  button: {
    width: '40px',
    height: '40px',
    backgroundColor: '#a0ff03'
  },
  icon: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  mainContainer: {
    display: 'flex',
    width: '97vw',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '60vh',
    padding: '0 20px',
    /* Vertical | Horizontal */
    margin: '4% auto'
  },
  statsContainer: {
    width: '25%',
    height: '100%',
    backgroundColor: 'transparent',
    border: '2px solid #a0ff03',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#a0ff03',
    fontWeight: 'bold',
  },
  gifContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    height: '100%',
    position: 'relative',
    border: '3px solid black',
    boxSizing: 'border-box',
  },
  gifWrapper: { 
    position: 'relative',
  },
  gif: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'cover',
  },
  buttonsContainer: {
    border: '3px solid black',
    width: '20%', 
    height: '100%',
    flexDirection: 'column', // Cambiamos la dirección a columna
    justifyContent: 'center',
    alignItems: 'center',   
  },
  rectangleButton: {
    objectFit: 'cover',
    backgroundColor: '#a0ff03',
    border: 'none',
    fontWeight: 'bold',
    fontSize: '20px', 
    padding: '25px 100px',
    width: '100%', // Establecemos el ancho del botón al 100% del contenedor
  },
  panelContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px 20px',
  },
  buttonPanel: {
    width: '25%',
    display: 'flex',
    backgroundColor: '#a0ff03',
    fontWeight: 'bold',
  },
  modal: {
    display: 'flex',
    padding: '100px',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  buttonmodal: {
    width: '100%',
    display: 'flex',
    backgroundColor: '#a0ff03',
    fontWeight: 'bold',
  },
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