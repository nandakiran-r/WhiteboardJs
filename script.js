const pen_range = document.querySelector('.pen-range');
const myTimeout = setTimeout(load_pen, 100);
function load_pen() {
    pen_range.value = "5";
  }

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
document.oncontextmenu = function() {
    return false;
}
start_background_color = "white";

function eraser() {
    draw_color = start_background_color
    draw_width = 40;
}
function save_img() {
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'Image.png');
    let dataURL = canvas.toDataURL('image/png');
    let url = dataURL.replace(/^data:image\/png/,'data:application/octet-stream');
    downloadLink.setAttribute('href', url);
    downloadLink.click();
}

function change_color(color) {
    draw_color = color;
    draw_width = document.querySelector('.pen-range').value;
}
const drawings = [];
let cursorX;
let cursorY;
let prevCursorX;
let prevCursorY;
let offsetX = 0;
let offsetY = 0;
let scale = 1;
function clear_canvas() {
    context.fillStyle = start_background_color;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);
}
function toScreenX(xTrue) {return (xTrue + offsetX) * scale;}
function toScreenY(yTrue) {return (yTrue + offsetY) * scale;}
function toTrueX(xScreen) {return (xScreen / scale) - offsetX;}
function toTrueY(yScreen) {return (yScreen / scale) - offsetY;}
function trueHeight() {return canvas.clientHeight / scale;}
function trueWidth() {return canvas.clientWidth / scale;}
function redrawCanvas() {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < drawings.length; i++) {
        const line = drawings[i];
        drawLine(toScreenX(line.x0), toScreenY(line.y0), toScreenX(line.x1), toScreenY(line.y1));
    }
}
redrawCanvas();
window.addEventListener("resize", (event) => {
});
canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mouseup', onMouseUp, false);
canvas.addEventListener('mouseout', onMouseUp, false);
canvas.addEventListener('mousemove', onMouseMove, false);

canvas.addEventListener('touchstart', onTouchStart);
canvas.addEventListener('touchend', onTouchEnd);
canvas.addEventListener('touchcancel', onTouchEnd);
canvas.addEventListener('touchmove', onTouchMove);
let leftMouseDown = false;
let rightMouseDown = false;

function onMouseDown(event) {
    if (event.button == 0) {
        leftMouseDown = true;
        rightMouseDown = false;
    }
    if (event.button == 2) {
        rightMouseDown = true;
        leftMouseDown = false;
    }
    cursorX = event.pageX;
    cursorY = event.pageY;
    prevCursorX = event.pageX;
    prevCursorY = event.pageY;
}

function onMouseMove(event) {
    cursorX = event.pageX;
    cursorY = event.pageY;
    const scaledX = toTrueX(cursorX);
    const scaledY = toTrueY(cursorY);
    const prevScaledX = toTrueX(prevCursorX);
    const prevScaledY = toTrueY(prevCursorY);

    if (leftMouseDown) {
        drawings.push({
            x0: prevScaledX,
            y0: prevScaledY,
            x1: scaledX,
            y1: scaledY
        })
        drawLine(prevCursorX, prevCursorY, cursorX, cursorY);
    }
    prevCursorX = cursorX;
    prevCursorY = cursorY;
}

function onMouseUp() {
    leftMouseDown = false;
    rightMouseDown = false;
}

draw_color = "black"
draw_width = "5";

function drawLine(x0, y0, x1, y1) {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = draw_color;
    context.lineWidth = draw_width;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();
}
const prevTouches = [null, null]; // up to 2 touches
let singleTouch = false;
let doubleTouch = false;

function onTouchStart(event) {
    if (event.touches.length == 1) {
        singleTouch = true;
        doubleTouch = false;
    }
    if (event.touches.length >= 2) {
        singleTouch = false;
        doubleTouch = true;
    }
    prevTouches[0] = event.touches[0];
    prevTouches[1] = event.touches[1];


}

function onTouchMove(event) {
    const touch0X = event.touches[0].pageX;
    const touch0Y = event.touches[0].pageY;
    const prevTouch0X = prevTouches[0].pageX;
    const prevTouch0Y = prevTouches[0].pageY;

    const scaledX = toTrueX(touch0X);
    const scaledY = toTrueY(touch0Y);
    const prevScaledX = toTrueX(prevTouch0X);
    const prevScaledY = toTrueY(prevTouch0Y);

    if (singleTouch) {
        drawings.push({
            x0: prevScaledX,
            y0: prevScaledY,
            x1: scaledX,
            y1: scaledY
        })
        drawLine(prevTouch0X, prevTouch0Y, touch0X, touch0Y);
    }
    prevTouches[0] = event.touches[0];
    prevTouches[1] = event.touches[1];
}

function onTouchEnd(event) {
    singleTouch = false;
    doubleTouch = false;
}

function pick_color() {
    var palette = document.getElementById("palette");
    var palette2 = document.getElementById("palette2");
    var palette3 = document.getElementById("palette3");
    if (palette.style.visibility === "visible" & palette2.style.visibility === "visible" & palette3.style.visibility === "visible") {
      palette.style.visibility = "hidden";
      palette2.style.visibility = "hidden";
      palette3.style.visibility = "hidden";
    } else {
      palette.style.visibility = "visible";
      palette2.style.visibility = "visible";
      palette3.style.visibility = "visible";
    }
}


var palette = document.getElementById('palette'),
    classList = 'classList' in palette;
for (var i = 0; i < palette.children.length; i++) {
    var child = palette.children[i];
    if (child.tagName == 'BUTTON') {
        if (classList) {
            child.classList.add('palette_color');
        } else {
            child.className += ' palette_color'
        }
    }
}


var palette2 = document.getElementById('palette2'),
    classList = 'classList' in palette2;
for (var i = 0; i < palette2.children.length; i++) {
    var child = palette2.children[i];
    if (child.tagName == 'BUTTON') {
        if (classList) {
            child.classList.add('palette_color');
        } else {
            child.className += ' palette_color'
        }
    }
}


var palette3 = document.getElementById('palette3'),
    classList = 'classList' in palette3;
for (var i = 0; i < palette3.children.length; i++) {
    var child = palette3.children[i];
    if (child.tagName == 'BUTTON') {
        if (classList) {
            child.classList.add('palette_color');
        } else {
            child.className += ' palette_color'
        }
    }
}

const palette_contents = document.querySelectorAll('.palette_color');
palette_contents.forEach(palette_color => {
    palette_color.style.backgroundColor = palette_color.id;
});
