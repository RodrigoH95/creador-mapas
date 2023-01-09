const mapRouter = require("express").Router();
const Map = require("../models/map");

mapRouter.get("/", async (req, res) => {
  const maps = await Map.find({});
  return res.json(maps);
});

mapRouter.post("/", async (req, res) => {
  const body = req.body;
  if(!body) return res.status(400);

  const map = new Map({
    name: body.name,
    width: body.width,
    height: body.height,
    code: body.code,
    img: body.img
  });

  const savedMap = await map.save();

  res.status(201);
});

module.exports = mapRouter;