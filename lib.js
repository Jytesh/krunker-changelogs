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

class Generator {
  constructor(changes, headerImage) {
    if (changes.length < 10) {
      return;
    }
    this.headerImage = headerImage;
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

    const w = canvas.width,
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

    const dw = w - 80;
    const dh = this.headerImage.height * (dw / this.headerImage.width);
    ctx.filter = "drop-shadow(0 0 32px #202020)";
    ctx.drawImage(this.headerImage, 40, 32, dw, dh);
    ctx.filter = "none";

    ctx.fillStyle = ctx
      .createLinearGradient(40, 32, 40, 32 + dh)
      .addColorStop(0, "#0F0F0FCC")
      .addColorStop(1, "#00000000");
    ctx.fillRect(40, 32, dw, dh);

    // UPDATE VERSION
    if (this.version !== null) {
      ctx.setFill(colours.Orange);
      ctx.filter = "drop-shadow(0 0 8px #202020)";
      ctx.roundedRect(62, 62, 320 + textWidth, 102, 16);
      ctx.drawImage(images.find((e) => e.name == "Logo").img, 68, 62, 96, 96);
      ctx.filter = "none";
      ctx.setFill(colours.Header);
      ctx.fillText(`Update ${this.version}`, 320 - textWidth, 120);
    }

    ctx.font = "42px FFF Forward";
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
    let y = 520;
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
      ctx.font = "42px FFF Forward";
      ctx.fillText(cat, 162, y + 60);
      y += 120;

      ctx.fillStyle = gradient2;
      ctx.roundedRect(52, y, w - 100, lines.length * 62 + 32, 16);

      ctx.fillStyle = "#efefef";
      ctx.font = "36px FFF Forward";
      for (const i in lines) {
        const line = lines[i];
        ctx.fillText(line, 72, y + 52 + i * 62);
      }
      y += lines.length * 62 + 52;
    });
  }
}

function loadImage(url) {
  const defer = new DeferredPromise();
  const img = new Image();
  img.origin = "anonymous";
  img.src = url;
  img.onload = () => defer.resolve(img);
  img.onerror = defer.reject;
  return defer.promise;
}

globalThis.DeferredPromise = DeferredPromise;
globalThis.Generator = Generator;
globalThis.loadImage = loadImage;

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
const addColorStop = CanvasGradient.prototype.addColorStop;
CanvasGradient.prototype.addColorStop = function (...args) {
  addColorStop.bind(this)(...args);
  return this;
};
