const express = require("express");
const app = express();
const axios = require("axios");
const mysql = require("mysql2/promise");
const path = require("path");
const cors = require("cors");
app.use(cors());

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const PORT = process.env.JOKE_PORT || 3000;
const dbConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "admin",
  password: process.env.MYSQL_PASSWORD || "admin",
  database: process.env.MYSQL_DATABASE || "joke",
  port: process.env.MYSQL_PORT || 3306,
};

const pool = mysql.createPool(dbConfig);

app.use(express.static(__dirname + "/public", { index: "joke.html" }));

app.get("/types", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM joke_type");
    res.json(rows);
  } catch (err) {
    console.error("Error executing query:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/joke/:type?", async (req, res) => {
  try {
    const type = req.params.type || "any";
    let count = parseInt(req.query.count, 10) || 1;

    let query = "";
    let queryParams = [];
    if (type === "any") {
      query = `SELECT j.id, j.setup, j.punchline, t.type FROM joke j INNER JOIN joke_type t ON j.type = t.id ORDER BY RAND() LIMIT ${count}`;
      //query =
      //  "SELECT j.id, j.setup, j.punchline, t.type FROM joke j INNER JOIN joke_type t ON j.type = t.id ORDER BY RAND() LIMIT 1";
      //queryParams = [count];
    } else {
      query = `SELECT j.id, j.setup, j.punchline, t.type FROM joke j INNER JOIN joke_type t ON j.type = t.id WHERE t.type = '${type}' ORDER BY RAND() LIMIT ${count}`;
      //query =
      //  "SELECT j.id, j.setup, j.punchline, t.type FROM joke j INNER JOIN joke_type t ON j.type = t.id WHERE t.type = ? ORDER BY RAND() LIMIT ?";
      //queryParams = [type, count];
    }

    const [rows] = await pool.execute(query, queryParams);

    res.json(rows);
  } catch (err) {
    console.error("Error executing query:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use(express.json());

app.post("/joke", async (req, res) => {
  try {
    const { setup, punchline, type } = req.body;

    const [rows] = await pool.execute(
      `SELECT id FROM joke_type WHERE type = '${type}'`
    );
    if (rows.length === 0) {
      await pool.execute(`INSERT INTO joke_type (type) VALUES ('${type}')`);
    }

    const [result] = await pool.execute(
      `INSERT INTO joke (setup, punchline, type) VALUES ('${setup}', '${punchline}', (SELECT id FROM joke_type WHERE type = '${type}'))`
    );

    res.json({ id: result.insertId });
  } catch (err) {
    console.error("Error executing query:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
