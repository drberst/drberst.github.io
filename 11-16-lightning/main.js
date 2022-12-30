// technique for this demo found here
// http://stackoverflow.com/questions/22003491/animating-canvas-to-look-like-tv-noise

const canvas = document.querySelector("canvas"),
    ctx = canvas.getContext("2d");

// canvas.width = canvas.height = 128;

resize();
// window.onresize = resize;

function resize() {
    canvas.width = 0.9 * window.innerWidth * window.devicePixelRatio;
    canvas.height = 0.9 * window.innerHeight * window.devicePixelRatio;
    canvas.style.width = 0.9 * window.innerWidth + "px";
    canvas.style.height = 0.9 * window.innerHeight + "px";
}

function noise(ctx) {
    const w = ctx.canvas.width,
        h = ctx.canvas.height,
        iData = ctx.createImageData(w, h),
        buffer32 = new Uint32Array(iData.data.buffer),
        len = buffer32.length;
    let i = 0;

    for (; i < len; i++) if (Math.random() < 0.5) buffer32[i] = 0xffffffff;

    ctx.putImageData(iData, 0, 0);
}

function printGrid(ctx) {
    const w = ctx.canvas.width,
        h = ctx.canvas.height,
        iData = ctx.createImageData(w, h),
        buffer32 = new Uint32Array(iData.data.buffer),
        len = buffer32.length;
    const array = fillArray(8, 8);
    for (let i = 0; i < len; i++) {
        buffer32[i] = Math.random() * 0xffffffff;
    }

    ctx.putImageData(iData, 0, 0);
}
function fillArray(w, h) {
    let result = [];
    for (let y = 0; y < h; y++) {
        result[y] = [];
        for (let x = 0; x < w; x++) {
            let element = Math.random();
            while (element > 0.4) element = Math.random();
            result[y][x] = element;
        }
    }
    return result;
}
function printFromArray(array, w, h, xSize, ySize) {
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const element = array[y][x];
            ctx.fillStyle = `hsl(255, 100%, ${element * 100}%)`;
            // ctx.fillStyle = `white`;
            ctx.fillRect(x * xSize, y * ySize, xSize, ySize);
        }
    }
}
window.fillArray = fillArray;
let X = ctx.canvas.width / 2;
let Y = 0;
function walker() {
    if (Math.random() < 0.5) Y += 10;
    if (Math.random() < 0.5) X += 10;
    if (Y < 0) Y = 0;
    if (X < 0) X = 0;
    if (Y > ctx.canvas.height) Y = 0;
    if (X > ctx.canvas.width) X = 0;

    ctx.fillRect(X, Y, 10, 10);
    requestAnimationFrame(walker);
}
function chooseNextPosition() {
    // get
}
let size = 128;
let noiseArray = fillArray(size, size);

walker_framecount = 0;
function walker2() {
    walker_framecount++;
    if (walker_framecount % 100 == 0) console.log("Walker frame #", walker_framecount);
    let xSize = ctx.canvas.width / size;
    let ySize = ctx.canvas.height / size;

    if (Y < 0) Y = 0;
    if (X < 0) X = 0;
    if (Y + ySize > ctx.canvas.height) Y = 0;
    if (X + xSize > ctx.canvas.width) X = 0;
    if (Y + ySize > ctx.canvas.height || X + xSize > ctx.canvas.width) {
        Y = 0;
        X = ctx.canvas.width / 2;
    }
    let val = noiseArray[Math.floor(Y / ySize)][Math.floor(X / xSize)];
    // console.log("X", X, "Y", Y, "Val", val);
    // if (Math.random() < val)
    Y += ySize;
    if (Math.random() < val) X += xSize;
    // if (Math.random() < val) X += xSize * 2;
    // else Y = (ctx.canvas.height / 2 + Y) / 2;
    // if (Y < 0) Y = 0;
    // if (X < 0) X = 0;
    if (Y > ctx.canvas.height || X > ctx.canvas.width) {
        Y = 0;
        X = ctx.canvas.width / 2;
    }
    // if (X > ctx.canvas.width) X = 0;

    ctx.fillRect(X - xSize, Y - ySize, xSize, ySize);
    requestAnimationFrame(walker2);
}

(function loop() {
    // noise(ctx);
    // printGrid(ctx);
    // let size = 64;
    const array = fillArray(size, size);
    printFromArray(array, size, size, ctx.canvas.width / size, ctx.canvas.height / size);
    ctx.fillStyle = `hsla(255, 0%, ${1.0 * 100}%,50%)`;
    // walker2();
    // setInterval(walker2, 125);
    requestAnimationFrame(walker2);
})();
