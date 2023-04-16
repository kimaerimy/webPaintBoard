const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const lineWidth = document.getElementById("line-width");
const colorInput = document.getElementById("color-input");
const palette = document.getElementById("palette");
const modeButton = document.getElementById("mode-button");
const destroyButton = document.getElementById("reset-button");
const eraseButton = document.getElementById("eraser-button");
const fileInput = document.getElementById("file-input");
const textInput = document.getElementById("text-input");
const saveButton = document.getElementById("save-button");

let canvas_width = window.innerWidth * 0.6;
let canvas_height = window.innerHeight - 50;

canvas.width = canvas_width;
canvas.height = canvas_height;
ctx.lineWidth = lineWidth.value;

let isPainting = false;
let isFilling = false;

canvas.addEventListener("mousedown", () => {
  isPainting = true;
});

canvas.addEventListener("mousemove", (event) => {
  if (isPainting) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  }
  ctx.moveTo(event.offsetX, event.offsetY);
});

canvas.addEventListener("mouseup", () => {
  isPainting = false;
  ctx.beginPath();
});

canvas.addEventListener("mouseleave", () => {
  isPainting = false;
});

canvas.addEventListener("click", () => {
  if (isFilling) {
    ctx.fillRect(0, 0, canvas_width, canvas_height);
  }
});
lineWidth.addEventListener("change", (event) => {
  ctx.lineWidth = event.target.value;
});

colorInput.addEventListener("change", (event) => {
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
});

palette.addEventListener("click", (event) => {
  const {
    target: {
      dataset: { color },
    },
  } = event;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  colorInput.value = color;
});

modeButton.addEventListener("click", () => {
  if (isFilling) {
    isFilling = false;
    modeButton.innerText = "Fill";
  } else {
    isFilling = true;
    modeButton.innerText = "Draw";
  }
});

destroyButton.addEventListener("click", () => {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas_width, canvas_height);
});

eraseButton.addEventListener("click", () => {
  ctx.strokeStyle = "white";
  if (isFilling) {
    isFilling = false;
  }
});

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.src = url;
  image.onload = function () {
    ctx.drawImage(image, 0, 0, canvas_width, canvas_height);
    fileInput.value = null;
  };
});

canvas.addEventListener("dblclick", (event) => {
  ctx.save();
  ctx.lineWidth = 1;
  ctx.fillText("hello Text", event.offsetX, event.offsetY);
  ctx.restore();
});

saveButton.addEventListener("click", () => {
  const url = canvas.toDataURL();
  const a = document.createElement("a");
  a.href = url;
  a.download = "test.png";
  a.click();
});

window.addEventListener("resize", () => {
  ctx.save();
  canvas_width = window.innerWidth * 0.6;
  canvas_height = window.innerHeight - 50;

  canvas.width = canvas_width;
  canvas.height = canvas_height;
  ctx.restore();
});

document.getElementById("button-wrap").addEventListener("click", (event) => {
  const classList = Array.from(event.target.classList);
  if (classList.includes("active")) {
    event.target.classList.remove("active");
  } else {
    event.target.classList.add("active");
  }
});
