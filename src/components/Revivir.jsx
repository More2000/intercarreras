import React, { useState } from "react";
import axios from "axios";
import { notification } from "antd";

const Revivir = () => {
  const [loading, setLoading] = useState(false);

  const revivirPersonaje = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        "https://revivir-pub-js.vercel.app/revivir/publish",
        {
          vida: 100, // Convertir a número
        }
      );
      notification.success({
        message: "La mascotota ha revivido",
        description: "La mascota ha sido revivido con 100 de vida.",
        duration: 2,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error al revivir al personaje:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <button type="primary" onClick={revivirPersonaje}>
        Revivir
      </button>
    </div>
  );
};

export default Revivir;
