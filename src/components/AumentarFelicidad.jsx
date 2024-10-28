import React from "react";
import axios from "axios";
import { notification } from "antd";
const AumentarFelicidad = () => {
  const aumentarFelicidad = async () => {
    try {
      const response = await axios.post(
        "https://happy-pub-js.vercel.app/happy/publish",
        {
          happyValue: 30,
        }
      );
      console.log("Respuesta del servidor:", response.data);
      notification.success({
        message: "Felicidad aumentada",
        description: "La felicidad se ha aumentado en 30 puntos.",
        duration: 2,
      });
    } catch (error) {
      console.error("Error al aumentar la felicidad:", error);
      alert("Hubo un error al intentar aumentar la felicidad.");
    }
  };

  return (
    <div>
      <button onClick={aumentarFelicidad}>
        Aumentar Felicidad en 30 puntos
      </button>
    </div>
  );
};

export default AumentarFelicidad;
