const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const lineWidth = document.getElementById("line-width");
const colorInput = document.getElementById("color-input");
const palette = document.querySelector("#palette .palette-option-wrap");
const modeButton2 = document.getElementById("mode-button");
const destroyButton = document.getElementById("reset-button");
const eraseButton = document.getElementById("eraser-button");
const fileInput = document.getElementById("file-input");
const textInput = document.getElementById("text-input");
const saveButton = document.getElementById("save-button");

const modeButton = document.getElementById("mode-button");
const modeInput = document.querySelector("#mode");
let canvas_width = window.innerWidth * 0.6;
let canvas_height = window.innerHeight - 50;

canvas.width = canvas_width;
canvas.height = canvas_height;
ctx.lineWidth = lineWidth.value;

let isDrawing = false;
let isFilling = false;
const undoStack = [ctx.getImageData(0, 0, canvas.width, canvas.height)];

const onModeChange = (event) => {
  const target = event.target.closest(".button-item");
  const mode = target.dataset.mode;
  const modeSettings = document.querySelectorAll("#setting-wrap > div");
  Array.from(modeButton.querySelectorAll("li")).forEach((el) => {
    el.querySelector(".mode-button").classList.remove("active");
  });
  target.querySelector(".mode-button").classList.add("active");
  modeSettings.forEach((setting) => {
    if (setting.classList.contains(mode)) {
      setting.style.display = "block";
    } else {
      setting.style.display = "none";
    }
  });
  document.querySelector("#setting-wrap > h1").innerText = mode;
  modeInput.value = mode;
  setMode(modeInput.value);
  console.log(modeInput.value);
};

const setMode = (mode) => {
  switch (mode) {
    case "draw":
    case "fill":
      setColor(colorInput.value);
      break;
    case "erase":
      setColor("#fff");
      break;
    case "undo":
      undo();
      break;
    case "clear":
      clear();
      break;
    case "save":
      // saveImage();
      break;
    default:
  }
};
const setColor = (color) => {
  const mode = modeInput.value;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  if (mode !== "erase") {
    colorInput.value = color;
  }
};

const saveImage = () => {
  const url = canvas.toDataURL();
  const a = document.createElement("a");
  const extension = document.querySelector(
    "input[name='file-extension']:checked"
  ).value;
  a.href = url;
  a.download = `image.${extension}`;
  a.click();
};
const startDrawing = (event) => {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(event.offsetX, event.offsetY);
};
const draw = (event) => {
  if (!isDrawing) return;
  ctx.lineTo(event.offsetX, event.offsetY);
  ctx.stroke();
};
const stopDrawing = (event) => {
  isDrawing = false;
  if (event.type == "mouseup") {
    saveUndoStack();
  }
};

const undo = () => {
  if (undoStack.length > 1) {
    undoStack.pop();
    const previousState = undoStack[undoStack.length - 1];
    ctx.putImageData(previousState, 0, 0);
  }
};
const saveUndoStack = () => {
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  undoStack.push(data);
};
const onFill = (event) => {
  const mode = modeInput.value;
  if (mode === "fill") {
    ctx.fillRect(0, 0, canvas_width, canvas_height);
    saveUndoStack();
  }
};

const clear = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  undoStack.splice(1);
}

lineWidth.addEventListener("change", (event) => {
  ctx.lineWidth = event.target.value;
});

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.src = url;
  image.onload = function () {
    ctx.drawImage(image, 0, 0, canvas_width, canvas_height);
    saveUndoStack();
    fileInput.value = null;
  };
});

canvas.addEventListener("dblclick", (event) => {
  ctx.save();
  ctx.lineWidth = 1;
  ctx.fillText("hello Text", event.offsetX, event.offsetY);
  ctx.restore();
});

// window.addEventListener("resize", () => {
//   ctx.save();
//   canvas_width = window.innerWidth * 0.6;
//   canvas_height = window.innerHeight - 50;

//   canvas.width = canvas_width;
//   canvas.height = canvas_height;
//   ctx.restore();
// });

/* setting */
modeButton.addEventListener("click", onModeChange);
colorInput.addEventListener("change", (event) => setColor(event.target.value));
palette.addEventListener("click", (event) =>
  setColor(event.target.dataset.color)
);

/* Draw */
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);

/* Fill */
canvas.addEventListener("click", onFill);

/* Erase */
/* mode-option을 클릭했을 때, 바로 적용되어야 하는 것과
 * mode-option 클릭 후 -> canvas에 어떠한 동작을 했을 때 적용되어야 하는 것과 분리.....ㅠㅠㅠ
 */
// canvas.addEventListener("click", onErase);

/* Save */
saveButton.addEventListener("click", saveImage);
/* Load */
modeButton.querySelectorAll("li")[0].querySelector("div").click();
