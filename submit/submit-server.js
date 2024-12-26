const express = require("express");
const app = express();
const axios = require("axios");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
app.use(cors());

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const PORT = process.env.SUBMIT_PORT || 3200;
const JOKE_PORT = process.env.JOKE_CONTAINER_PORT || 3000;
const JOKE_HOST = process.env.JOKE_HOST || "localhost";
const BACKUP_DIR = path.join(__dirname, "backup");
const BACKUP_FILE_PATH = path.join(__dirname, "backup", "backupTypes.json");

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

if (!fs.existsSync(BACKUP_FILE_PATH)) {
  fs.writeFileSync(BACKUP_FILE_PATH, JSON.stringify({ types: [] }), "utf-8");
}

function updateBackupFile(data) {
  try {
    fs.writeFileSync(BACKUP_FILE_PATH, JSON.stringify(data), "utf-8");
    console.log("Backup file updated successfully.");
  } catch (error) {
    console.error("Failed to update backup file:", error.message);
  }
}

app.use(express.static(__dirname + "/public", { index: "submit.html" }));

app.get("/types", async (req, res) => {
  try {
    console.log(`http://${JOKE_HOST}:${JOKE_PORT}/types`);
    const response = await axios.get(`http://${JOKE_HOST}:${JOKE_PORT}/types`);

    updateBackupFile(response.data);

    res.json(response.data);
  } catch (err) {
    console.log("Try to load backup");

    try {
      const backupData = fs.readFileSync(BACKUP_FILE_PATH, "utf-8");
      const types = JSON.parse(backupData);
      res.json(types);
    } catch (fsError) {
      console.error("Failed to load backup:", fsError.message);
      res.status(500).json({
        message: "Could not fetch joke types. Please try again later.",
      });
    }
  }
});

app.use(express.json());

app.post("/submit", async (req, res) => {
  try {
    const { setup, punchline, type } = req.body;
    console.log("Post: ", `http://${JOKE_HOST}:${JOKE_PORT}/joke`);
    console.log("Submitting joke:", setup, punchline, type);
    const response = await axios.post(
      `http://${JOKE_HOST}:${JOKE_PORT}/joke`,
      {
        setup,
        punchline,
        type,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Failed to submit joke:", error.message);
    res
      .status(503)
      .json({ message: "Joke submission failed. Please try again later." });
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
