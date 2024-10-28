import React from "react";
import axios from "axios";
import { notification } from "antd";

const AumentarVida = () => {
  const enviarNecesidades = (foodAmount, waterAmount) => {
    axios
      .post("https://necesidades-pub-js.vercel.app/necesidades/publish", {
        foodAmount,
        waterAmount,
      })
      .then((response) => {
        console.log("Respuesta del servidor:", response.data);
        notification.success({
          message: "Comida y agua enviados",
          description: "La comida y el agua se han enviado correctamente",
          duration: 2,
        });
      })
      .catch((error) => {
        console.error("Error al enviar los datos:", error);
        alert("Hubo un error al enviar los datos");
      });
  };

  return (
    <div>
      <button onClick={() => enviarNecesidades(30, 30)}>
        Enviar 30 de comida y agua
      </button>
      <button onClick={() => enviarNecesidades(50, 20)}>
        Enviar 50 de comida y 20 de agua
      </button>
    </div>
  );
};

export default AumentarVida;
