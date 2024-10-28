import axios from "axios";
import { useEffect, useState } from "react";

const DataComponent = ({ setData, setEstado }) => {
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://life-pub-js.vercel.app/estado");
      setData(response.data); // Actualiza los datos
      processEstado(response.data.estado); // Procesa el estado
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching the data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Procesa el valor de estado y establece el mensaje adecuado
  const processEstado = (estado) => {
    switch (estado) {
      case 1:
        setEstado("El personaje tiene hambre");
        break;
      case 2:
        setEstado("El personaje necesita agua");
        break;
      case 3:
        setEstado("El personaje está triste");
        break;
      case 4:
        setEstado("El personaje está sofocado por la temperatura");
        break;
      case 5:
        setEstado("El personaje tiene sueño");
        break;
      case 6:
        setEstado("El personaje está incómodo por la humedad");
        break;
      case 7:
        setEstado("El personaje está lleno");
        break;
      case 8:
        setEstado("El personaje ha muerto");
        break;
      case 9:
        setEstado("El personaje ha revivido");
        break;
      case 0:
      default:
        setEstado("Estado normal");
        break;
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return null; // No necesita renderizar nada ya que los datos son procesados en el padre
};

export default DataComponent;
