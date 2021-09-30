const axios = require("axios");
const { createWriteStream } = require("fs");

const imgs = [
  "Added",
  "Coding",
  "Fixes",
  "General",
  "Steam",
  "KPD",
  "Logo",
  "Map",
  "Keyboard",
  "Market",
  "Menu",
  "Meta",
  "Optimization",
  "Servers",
  "Other",
  "Settings",
  "Social",
];

const HOST = "REDACTED"
imgs.forEach(async (f) => {
  const src = HOST + "/assets/img/" + f + ".png";
  const res = await axios({ url: src, responseType: "stream" });
  const wStream = createWriteStream("./assets/img/" + f + ".png");
  res.data.pipe(wStream);
});
