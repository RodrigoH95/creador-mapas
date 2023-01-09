const express = require('express');
const cors = require('cors');
const mapRouter = require("./controllers/map.js");
const mongoose = require('mongoose');
const config = require("./utils/config");

const app = express();


mongoose.connect(config.MONGODB_URI)
  .then(() => console.log("Connected to mongoose"))
  .catch(err => console.log(err));

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use("/api/maps", mapRouter);

module.exports = app;