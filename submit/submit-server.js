const express = require("express");
const app = express();
const axios = require("axios");
const path = require("path");
const cors = require("cors");
app.use(cors());

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const PORT = process.env.SUBMIT_PORT || 3200;
const JOKE_PORT = process.env.JOKE_CONTAINER_PORT || 3000;
const JOKE_HOST = process.env.JOKE_HOST || "localhost";

app.use(express.static(__dirname + "/public", { index: "submit.html" }));

app.get("/types", async (req, res) => {
  try {
    console.log(`http://${JOKE_HOST}:${JOKE_PORT}/types`);
    const response = await axios.get(`http://${JOKE_HOST}:${JOKE_PORT}/types`);
    res.json(response.data);
  } catch (err) {
    console.error("Error getting types:", err.message);
    res.status(500).json({ error: "Internal Server Error", err: err });
  }
});

app.use(express.json());

app.post("/submit", async (req, res) => {
  try {
    const { setup, punchline, type } = req.body;
    console.log("Submitting joke:", setup, punchline, type);
    const response = await axios.post(`http://${JOKE_HOST}:${JOKE_PORT}/joke`, {
      setup,
      punchline,
      type,
    });
    res.json(response.data);
  } catch (err) {
    console.error("Error submitting joke:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
