const express = require("express");
const app = express();
const axios = require("axios");

const PORT = process.env.JOKE_PORT || 3000

app.use(express.static(__dirname + "/public", { index: "joke.html" }));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
