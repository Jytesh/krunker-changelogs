/* Version 1 by Sakurasao, Version 2 by Jytesh */
let headerImage, defaultHeaderImage;
const f = new FontFace("FFF Forward", "url(./assets/fonts/gamefont.woff2)");
const images = [];

let imagesLoaded = new DeferredPromise();
const colours = {
  Header: "#ffffff",
  Orange: "#ffbd3e",
  TopicHeader: "#505050",
  TopicHeaderBorder: "#787878",
  TopicBackground: "#202020",
  TopicFontColor: "#a6a6a6",
  Background: "#333333",
  Black: "#000000",
};

(async () => {
  const font = await f.load();
  document.fonts.add(font);
  console.debug("Loaded Font");

  defaultHeaderImage = await loadImage("./assets/img/Header.png");
  headerImage = defaultHeaderImage;

  let loadCount = 0;

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

  imgs.forEach((f) => {
    let img = new Image(),
      data = {};
    img.src = "./assets/img/" + f + ".png";
    data.img = img;
    data.img.onload = () => {
      loadCount++;

      if (loadCount === imgs.length) imagesLoaded.resolve();
    };
    data.img.scale = 0.5;

    switch (f) {
      case "General":
        data.keywords = ["general", "other"];
        data.img.scale = 1;
        break;

      case "KPD":
        data.keywords = ["kpd", "anti cheat"];
        break;

      case "Meta":
        data.keywords = ["balancing", "meta", "weapons", "gameplay"];
        break;

      case "Coding":
        data.keywords = ["krunkscript"];
        break;

      case "Keyboard":
        data.keywords = [
          "control",
          "controls",
          "keyboard",
          "keybind",
          "keyboard",
        ];
        break;

      case "Steam":
        data.keywords = ["steam"];
        break;

      case "Optimization":
        data.keywords = ["servers", "optimization", "optimizations"];
        break;

      case "Market":
        data.keywords = ["items", "market"];
        break;

      case "Menu":
        data.keywords = ["ui", "menu", "menus", "css"];
        break;

      case "Map":
        data.keywords = ["map", "changes", "games", "maps", "editor"];
        break;

      default:
        data.keywords = [];
        break;
    }

    data.name = f;
    images.push(data);
  });
})();

window.GEN = new Generator(``, headerImage);

const changelog = document.getElementById("changelog");

window.UPDATE = function () {
  window.GEN = new Generator(
    changelog.value.replace("All Changelogs", ""),
    headerImage
  );
};

window.dl = function () {
  const download = document.getElementById("download");
  const image = document.getElementById("output").toDataURL("image/png");
  download.setAttribute("href", image);
};

imagesLoaded.promise.then(() => {
  changelog.value = `Krunker had an update! v5.0.2
All Changelogs
Raid
​- Fixed issue with Raid showing up way to often
- Fixed some cheese spots on final boss
- Changes to final boss fight
- Raid unob is now tradable
- Added mystery weapon chest
Weapons & Balancing
​- Increased Tehchy-9 DMG from 18 to 20
Challenges
​- Added more map challenges
General
​- Fixed issue with Airdrops & High/Physical lighting
- Fixed time based challenge progress going over 100%`;
  UPDATE();
});

window.ondragover = (e) => e.preventDefault();
window.ondrop = (e) => {
  e.preventDefault();
  handleFile(e.dataTransfer.files[0]);
};
document.onpaste = function (e) {
  const item = e.clipboardData.items[0];
  if (item.type.indexOf("image") === 0) {
    const blob = item.getAsFile();
    handleFile(blob);
  }
};

function handleFile(file) {
  const reader = new FileReader();

  reader.addEventListener("load", async () => {
    headerImage = await loadImage(reader.result);
    UPDATE();
  });

  reader.readAsDataURL(file);
}
function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}
