/* Version 1 by Sakurasao, Version 2 by Jytesh */
CanvasRenderingContext2D.prototype.setFill = function (color) {
  this.fillStyle = color;
};
CanvasRenderingContext2D.prototype.setStroke = function (color) {
  this.strokeStyle = color;
};
CanvasRenderingContext2D.prototype.roundedRect = function (
  a,
  b,
  c,
  d,
  e = 0,
  f = !0,
  g = !1
) {
  if ("number" == typeof e) e = { tl: e, tr: e, br: e, bl: e };
  else {
    var h = { tl: 0, tr: 0, br: 0, bl: 0 };
    for (var i in h) e[i] = e[i] || h[i];
  }
  this.beginPath(),
    this.moveTo(a + e.tl, b),
    this.lineTo(a + c - e.tr, b),
    this.quadraticCurveTo(a + c, b, a + c, b + e.tr),
    this.lineTo(a + c, b + d - e.br),
    this.quadraticCurveTo(a + c, b + d, a + c - e.br, b + d),
    this.lineTo(a + e.bl, b + d),
    this.quadraticCurveTo(a, b + d, a, b + d - e.bl),
    this.lineTo(a, b + e.tl),
    this.quadraticCurveTo(a, b, a + e.tl, b),
    this.closePath(),
    f && this.fill(),
    g && this.stroke();
};

const f = new FontFace("FFF Forward", "url(./assets/fonts/gamefont.woff2)");
const images = [];

class DeferredPromise {
  constructor() {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  }
}

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

class Generator {
  constructor(changes, scaleMult) {
    if (changes.length < 10) {
      return;
    }

    let canvas = document.getElementById("output"),
      ctx = canvas.getContext("2d");

    changes = changes.split("\n").filter((e) => e.length > 1);

    this.canvas = canvas;
    this.ctx = ctx;

    this.version = changes[0].includes("had an update")
      ? changes.shift().split("!")[1].trim()
      : null;

    let cat = "General",
      type = "";
    // changes = changes.map((x) => {
    //   if (x.trim().startsWith("-")) return x;
    //   else return "* " + x;
    // });
    this.changes = new Map(); // insertion order
    changes.forEach((line) => {
      line = line.trim();
      if (line[0].match(/[A-Z]/)) return (cat = line);
      const changes = this.changes.get(cat) || [];
      changes.push(line);
      this.changes.set(cat, changes);
    });
    imagesLoaded.promise.then(() => this.gen(this.canvas, this.ctx));
  }

  /**
   *
   * @param {Canvas} canvas
   * @param {CanvasRenderingContext2D} ctx
   */
  gen(canvas, ctx) {
    ctx.font = "38px FFF Forward";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    let w = canvas.width,
      h = canvas.height,
      textWidth = this.version ? ctx.measureText(this.version).width : 0;

    // Border Fill
    ctx.setFill(colours.Orange);
    ctx.fillRect(0, 0, w, h);

    // Border Black Inline
    ctx.setFill(colours.Black);
    ctx.fillRect(8, 8, w - 16, h - 16);

    // Background
    ctx.setFill(colours.Background);
    ctx.fillRect(8, 8, w - 18, h - 18);

    // UPDATE VERSION
    if (this.version !== null) {
      ctx.setFill(colours.Orange);
      ctx.roundedRect(w - 58, 162, -320 - textWidth, -102, -16);
      ctx.filter = "drop-shadow(0 0 4px #202020) drop-shadow(0 0 4px #202020)";
      ctx.drawImage(
        images.find((e) => e.name == "Logo").img,
        w - 156,
        62,
        96,
        96
      );
      ctx.filter = "none";
      ctx.setFill(colours.Header);
      ctx.fillText(`Update ${this.version}`, w - 350 - textWidth, 120);
    }

    ctx.font = "32px FFF Forward";

    const gradient = ctx.createLinearGradient(32, 0, w - 256, 0);
    for (var t = 0; t <= 1; t += 0.02) {
      // convert linear t to "easing" t:
      gradient.addColorStop(
        1 - t,
        "hsla(360, 0%, 2%, " + (0.5 + easeInOut(t) * 0.5) + ")"
      );
    }
    const gradient2 = ctx.createLinearGradient(32, 0, w - 256, 0);
    for (var t = 0; t <= 1; t += 0.02) {
      // convert linear t to "easing" t:
      gradient2.addColorStop(
        t,
        "hsla(360, 0%, 15%, " + (0.8 + easeInOut(t) * 0.2) + ")"
      );
    }
    let y = 220;
    [...this.changes.entries()].forEach(([cat, lines]) => {
      const type =
        images.find(
          (a) =>
            a.name == cat ||
            cat.split(" ").some((f) => f == a.name) ||
            cat.split(" ").some((f) => a.keywords.includes(f.toLowerCase()))
        ) || images.find((a) => a.name == "General");
      ctx.fillStyle = gradient;
      ctx.roundedRect(32, y, w - 64, 100, 16);
      ctx.fillStyle = "#efefef";
      ctx.drawImage(type.img, 52, y + 12, 82, 82);
      ctx.fillText(cat, 162, y + 60);
      y += 120;

      ctx.fillStyle = gradient2;
      ctx.roundedRect(52, y, w - 100, lines.length * 62 + 32, 16);

      ctx.fillStyle = "#efefef";
      for (const i in lines) {
        const line = lines[i];
        ctx.fillText(line, 72, y + 52 + i * 62);
      }
      y += lines.length * 62 + 52;
    });
  }
}

window.GEN = new Generator(``, 1080, 1920, 1);

const changelog = document.getElementById("changelog");

window.UPDATE = function () {
  window.GEN = new Generator(changelog.value.replace("All Changelogs", ""));
};

window.dl = function () {
  const download = document.getElementById("download");
  const image = document
    .getElementById("output")
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream");
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

function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}
