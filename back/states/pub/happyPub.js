// Cargar variables de entorno desde el archivo .env
require("dotenv").config();

const express = require("express");
const mqtt = require("mqtt");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = mqtt.connect({
  host: process.env.HOST,
  port: 8883,
  protocol: "mqtts",
  username: process.env.USUARIO,
  password: process.env.PASSWORD,
  rejectUnauthorized: false,
});

const topic = "happy";

client.on("connect", () => {
  console.log("Publisher connected to broker.");
});

app.post("/happy/publish", (req, res) => {
  const { happyValue } = req.body;

  if (!happyValue === undefined) {
    return res.status(400).send("No se enviaron datos para publicar.");
  }

  const message = JSON.stringify({ happyValue });

  // Publicar el mensaje en el tópico de MQTT
  client.publish(topic, message, (err) => {
    if (err) {
      console.error("Error al publicar el mensaje:", err);
      return res
        .status(500)
        .send("Error al publicar el mensaje en el broker MQTT.");
    }

    console.log(`Datos publicados: ${message}`);
    res.status(200).send(`Datos publicados en el tópico ${topic}: ${message}`);
  });
});

// Manejar errores de conexión MQTT
client.on("error", (error) => {
  console.error("Connection error: ", error);
});

// Iniciar el servidor en el puerto 3000
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Servidor API REST ejecutándose en http://localhost:${PORT}`);
});
