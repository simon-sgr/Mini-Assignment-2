const express = require("express");
const app = express();
const axios = require("axios");

const PORT = process.env.SUBMMI_PORT || 3200

app.use(express.static(__dirname + "/public", { index: "submit.html" }));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
