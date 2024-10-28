// models/DataModel.js
const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    temperature: Number,
    humidity: Number,
    light: Number,
    estado: Number,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Data", dataSchema);
