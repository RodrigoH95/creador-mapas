import MapService from "./mapService.js";

const gridContainer = document.getElementById("grid");
const layerButtons = document.getElementById("layer-container");
const paletteButtons = document.getElementById("palette-container");
const mapCodeButton = document.getElementById("map-code");
const mapLoadButton = document.getElementById("map-load");
const mapResetButton = document.getElementById("map-reset");
const toggleGridButton = document.getElementById("toggle-grid");
const mapNameInfo = document.getElementById("map-name");
const mapsModal = document.getElementById("maps-modal");

let width = 9;
let height = 9;
const layersAmount = 3;
const gridSize = 32;
let figures = null;
let layerSelected = 0;
let tileSelected = 0;

let currentMap = {
  name: "Sample map",
  width: 9,
  height: 9,
  code: "26-0-0-26-0-0-26-0-0-26-0-0-17-6-5-26-0-0-26-0-0-26-0-0-26-0-0-16-0-0-16-0-0-16-0-0-16-0-0-17-6-0-16-0-0-16-0-0-16-0-0-16-0-0-16-0-1-17-0-0-17-0-0-17-0-0-17-6-0-17-0-0-17-0-0-17-0-0-16-0-1-16-0-0-17-0-2-19-0-0-19-0-0-19-0-0-19-0-0-19-0-0-17-0-0-16-0-0-16-0-1-17-0-20-17-0-21-17-0-21-17-0-21-17-0-21-17-0-21-17-0-22-16-0-0-16-0-0-16-0-0-16-0-0-16-0-1-16-0-0-16-0-0-16-0-0-16-0-1-16-0-0-16-0-0-16-0-1-16-0-0-16-0-0-16-0-1-16-0-0-16-0-1-16-0-0-16-0-0-18-0-0-18-0-0-18-0-0-18-0-2-18-0-0-18-0-0-18-0-0-18-0-2-18-0-0-10-0-0-10-0-0-10-0-0-10-0-0-10-0-0-10-0-0-10-0-0-10-0-0-10-0-0",
};

// Funcion necesaria para cuando se cargan mapas
function calculateVariables() {
  figures = (width * height).toString().length;
  gridContainer.style.width = width * gridSize + "px";
}

calculateVariables();

const TILEAMOUNT = 26; // Reemplazar por la cantidad de imagenes en la carpeta ./assets/img | Sirve para generar los botones de materiales

for (let i = 0; i <= TILEAMOUNT; i++) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.id = `tile-${i}`;
  const img = document.createElement("img");
  img.src = `./assets/img/${i}.png`;
  btn.appendChild(img);
  paletteButtons.appendChild(btn);
}

function createGrid() {
  const size = width * height;
  for (let i = 0; i < size; i++) {
    const cell = document.createElement("div");
    cell.classList.add("grid-cell");
    const id = getId(i + 1);
    cell.id = id;
    createLayers(cell, layersAmount);
    gridContainer.appendChild(cell);
  }
}

function getId(cellNumber) {
  return "0".repeat(figures - cellNumber.toString().length) + cellNumber;
}

function createLayers(cell, amount) {
  for (let i = 0; i < amount; i++) {
    const layer = document.createElement("div");
    layer.classList.add("layer", i);
    const img = document.createElement("img");
    img.classList.add("cell-img");
    img.src = `./assets/img/${0}.png`;
    layer.appendChild(img);
    cell.appendChild(layer);
  }
}

async function generateMap(name) {
  const map = {};
  const images = document.getElementsByClassName("cell-img");
  map.name = name;
  map.width = width;
  map.height = height;
  map.code = [...images].map((img) => getTileCode(img)).join("-");
  const mapURL = await html2canvas(gridContainer);
  map.img = mapURL.toDataURL();
  return map;
}

function getTileCode(img) {
  let str = img.src;
  return str.substr(1 + str.lastIndexOf("/")).split(".")[0];
}

function fillGrid(code) {
  gridContainer.innerHTML = "";
  calculateVariables();
  createGrid();
  const tiles = code.split("-");
  const images = document.getElementsByClassName("cell-img");
  for (let i = 0; i < width * height * layersAmount; i++) {
    images[i].src = `./assets/img/${tiles[i]}.png`;
  }
}

function loadMap() {
  const map = currentMap;
  if (!map) return;
  mapNameInfo.innerText = map.name;
  width = map.width;
  height = map.height;
  fillGrid(map.code);
}

function resetMap() {
  gridContainer.innerHTML = "";
  createGrid();
}

function toggleGrid(hide = false) {
  const rule = [...document.styleSheets[0].cssRules].filter(
    (rule) => rule.selectorText === ".grid-cell"
  )[0];
  if (hide) rule.style.border = "none";
  else {
    rule.style.border === "1px solid black"
      ? (rule.style.border = "none")
      : (rule.style.border = "1px solid black");
  }
}

createGrid();
fillGrid(currentMap.code);

gridContainer.addEventListener("click", (e) => {
  [...e.target.children][
    layerSelected
  ].childNodes[0].src = `./assets/img/${tileSelected}.png`;
});

layerButtons.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;
  layerSelected = e.target.id.split("-")[1];
  [...document.getElementsByClassName("layer-button")].forEach((button) => {
    if (button.id === e.target.id) {
      button.classList.add("layer-active");
    } else {
      button.classList.remove("layer-active");
    }
  });
});

paletteButtons.addEventListener("click", (e) => {
  tileSelected = e.target.id.split("-")[1];
});

mapCodeButton.addEventListener("click", async (e) => {
  const name = prompt("Your map name:");
  if (!name) return;
  mapNameInfo.innerText = name;
  const map = await generateMap(name);
  MapService.createMap(map);
  localStorage.setItem("map", JSON.stringify(map));
});

mapLoadButton.addEventListener("click", async (e) => {
    mapsModal.innerHTML = "";
    let maps = await MapService.getAll();
    maps.forEach(map => {
      const mapCard = document.createElement("div");
      const mapName = document.createElement("div");
      const mapImg = document.createElement("img");
      mapImg.src = map.img;
      mapImg.style.width = "200px";
      mapImg.style.height = "200px";
      mapName.innerText = map.name;
      mapCard.appendChild(mapName);
      mapCard.appendChild(mapImg);
      mapCard.onclick = () => {
        currentMap = map;
        loadMap();
      };
      mapsModal.appendChild(mapCard);
    });
    ;
});

toggleGridButton.addEventListener("click", () => {
  toggleGrid();
});

mapResetButton.onclick = resetMap;
