// technique for this demo found here
// http://stackoverflow.com/questions/22003491/animating-canvas-to-look-like-tv-noise

// const canvas = document.querySelector("canvas"),
//     ctx = canvas.getContext("2d");

// // canvas.width = canvas.height = 128;

// resize();
// // window.onresize = resize;

// function resize() {
//     canvas.width = 0.9 * window.innerWidth * window.devicePixelRatio;
//     canvas.height = 0.9 * window.innerHeight * window.devicePixelRatio;
//     canvas.style.width = 0.9 * window.innerWidth + "px";
//     canvas.style.height = 0.9 * window.innerHeight + "px";
// }

window.fillArray = fillArray;

let OPTIONS = {
    branchChance: 0.01,
    repeats: 2,
    bgMax: 0.1,
    size: 100,
    maxBolts: 10,
    hue: 220,
    saturation: 60,
    boltColor: 220,
    boltOpacity: 1,
    ms: 1,
};
let Main = {
    size: OPTIONS.size,
    array: [],
    small_canvas: document.getElementById("small_canvas"),
    ctx: small_canvas.getContext("2d"),
    bolts: [],
    loops: 0,
    intervalID: "",
    updates: [],
};
(function loop() {
    console.time();
    // noise(ctx);
    // printGrid(ctx);
    // let size = 64;
    console.timeStamp()
    Main.array = fillArray(Main.size, Main.size);
    console.timeLog()
    // printFromArray(array, size, size, ctx.canvas.width / size, ctx.canvas.height / size);
    printFromArray(Main.array, Main.size, Main.size);

    console.log("DONE printFromArray()")
    console.timeLog()
    let bolt = newBolt({ x: Math.floor(Main.size / 2) });
    printBolt(bolt);
    Main.bolts.push(bolt);
    // Main.bolts.push(newBolt({ x: Math.floor(Main.size / 4) }));
    // ctx.fillStyle = `hsla(255, 0%, ${1.0 * 100}%,50%)`;
    // walker2();
    // interateBolts();
    Main.intervalID = setInterval(interateBolts, OPTIONS.ms);
    const myPromise = new Promise((resolve, reject) => {
        Main.resolve = resolve;
        requestAnimationFrame(interateBolts);
    });
    myPromise.then(() => {
        console.log("done!! Main=", Main);
        console.timeEnd()

    });
})();
/**
 * Ideas for things to add
 * - Less pixelated?
 * - Fire / Rain / Snow
 * - Sound
 * - Final "Strike" animation with thunder after the branching is over
 * - setting for animation speed or instant speed
 * - redrawing the background grid after it's altered by branching
 * - simulation of a magnetic draw towards the ground rather than gravitational
 */

function resizeCanvas(aCanvas, x, y) {
    aCanvas.width = x;
    aCanvas.height = y;
    let radius = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight;
    // aCanvas.style.width = 0.9 * window.innerWidth + "px";
    // aCanvas.style.height = 0.9 * window.innerHeight + "px";
    // aCanvas.style.width = x * 10 + "px";
    // aCanvas.style.height = y * 10 + "px";
    aCanvas.style.width = 0.9 * radius + "px";
    aCanvas.style.height = 0.9 * radius + "px";
}

function fillArray(w, h) {
    let result = [];
    for (let y = 0; y < h; y++) {
        result[y] = [];
        for (let x = 0; x < w; x++) {
            // let element = Math.random() > 0.5 ? 1 : 0;
            let element = Math.random();
            while (element > OPTIONS.bgMax) element = Math.random();
            result[y][x] = element;
        }
    }
    return result;
}
function newBolt(input) {
    let result = {};
    result.x = 0;
    result.y = 0;
    result.n = Main.bolts.length;
    Object.assign(result, input);
    return result;
}

function printBolt(aBolt) {
    let ctx = Main.ctx;
    ctx.fillStyle = `hsla(${OPTIONS.boltColor}, 100%, ${0.9 * 100}%,${OPTIONS.boltOpacity}%)`;
    ctx.fillRect(aBolt.x, aBolt.y, 1, 1);
}
function printUpdatesFromArray() {
    const small_canvas = document.getElementById("small_canvas");

    const ctx2 = small_canvas.getContext("2d");
    Main.updates.forEach((element) => {
        let x = element.x;
        let y = element.y;
        let arrayVal = Main.array[y][x];
        ctx2.fillStyle = `hsl(${OPTIONS.hue}, ${OPTIONS.saturation}%, ${arrayVal * 100}%)`;
        ctx2.fillRect(x, y, 1, 1);
    });
    Main.updates = [];
}
function printFromArray(array, w, h) {
    console.log("Array Debug")
    const small_canvas = document.getElementById("small_canvas");
    resizeCanvas(small_canvas, w, h);
    const ctx2 = small_canvas.getContext("2d");

    // ctx2.scale(25, 25);
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const element = array[y][x];
            ctx2.fillStyle = `hsl(${OPTIONS.hue}, ${OPTIONS.saturation}%, ${element * 100}%)`;
            // ctx.fillStyle = `white`;
            // ctx2.imageSmoothingEnabled = false;

            ctx2.fillRect(x, y, 1, 1);
        }
    }
}

function findMinIndex(array) {
    let min = 2;
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (element < min) {
            min = element;
            index = i;
        }
        if (element == min && Math.random() > 0.5) {
            index = i;
        }
    }
    // console.log("min", min, "index", index);
    return index;
}
function findMaxIndex(array) {
    let max = 0;
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (element > max) {
            max = element;
            index = i;
        }
        if (element == max && Math.random() > 0.5) {
            index = i;
        }
    }
    // console.log("min", min, "index", index);
    return index;
}

function interateBolts() {
    let deltaX = 1;
    Main.bolts.forEach((bolt) => {
        // console.log(Main.array);
        // console.log("x", bolt.x, "y", bolt.y);
        if (bolt.y + 1 > Main.size - 1) {
            bolt.y = 0;
            bolt.x = Math.floor(Main.size / 2);
            Main.loops++;
        }
        let left = Main.array[bolt.y + 1][bolt.x - 1];
        let center = Main.array[bolt.y + 1][bolt.x];
        let right = Main.array[bolt.y + 1][bolt.x + 1];
        let choices = [left, center, right];
        // let minIndex = findMinIndex(choices);
        let minIndex = findMaxIndex(choices);
        // console.log("choice should be", choices[minIndex]);
        let lb = newBolt({ x: bolt.x - 1, y: bolt.y + 1 });
        // let cb = newBolt({ x: bolt.x, y: bolt.y + 1 });
        let rb = newBolt({ x: bolt.x + 1, y: bolt.y + 1 });
        // printBolt(lb);
        // printBolt(cb);
        // printBolt(rb);
        // console.log("next 3:", left, center, right);
        bolt.y++;

        if (minIndex == 0) bolt.x -= 1;
        if (minIndex == 1) {
            let roll = Math.random();
            let x = bolt.x;
            if (roll > 0.5) x += deltaX;
            else x -= deltaX;
            if (Math.random() > OPTIONS.branchChance) {
                let branch = newBolt({ x: x, y: bolt.y });
                Main.bolts.push(branch);
                if (Main.bolts.length > OPTIONS.maxBolts) {
                    let randomIndex = Math.floor(Math.random() * Main.bolts.length);
                    // console.log("random index is ", randomIndex);
                    Main.bolts.splice(randomIndex, 1);
                }
                // Main.bolts = Main.bolts.filter(function (item) {
                //     return item.n !== randomIndex;
                // });
            }
        }
        if (minIndex == 2) bolt.x += 1;

        // console.log("next x is", bolt.x);

        // let roll = Math.random();
        // if (roll > 0.7) bolt.x += 1;
        // if (roll < 0.3) bolt.x -= 1;

        // if (bolt.y > Main.size) {
        //     bolt.y = 0;
        //     bolt.x = Math.floor(Main.size / 2);
        // }
        Main.array[bolt.y][bolt.x] *= 1.5;
        Main.updates.push(bolt);
        // printBolt(bolt);
    });

    if (Main.loops < OPTIONS.repeats * Main.bolts.length) {
        // console.log(Main.bolts.length);
        requestAnimationFrame(interateBolts);
        // interateBolts();
    } else {
        clearInterval(Main.intervalID);
        Main.resolve("foo");
    }
    // printFromArray(Main.array, Main.size, Main.size);
    printUpdatesFromArray();
}
