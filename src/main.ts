/*
1. Global vars
2. collections of data
3. collections of functions
4. Using pieces 1-3 for stage 2 complexity
5. Assembling into final complexity
*/

let h = 8;
let w = 8;
const GLOB = { // Universal constants
    HEIGHT: h, //Height / Y
    WIDTH: w, //Width  / X
    COUNT: h * w,
    REFGRID: new Grid(w, h),
    TILEPX: 16,
    SPACING: 0,
    container_div: "#layer_bg",
    LOWER: "abcdefghijklmnopqrstuvqxyz",
    UPPER: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
}
const MAPS = { // Reality arisen from constants
    id2cell: new Map(),
    cell2val: new Map()
}
// const FUN = { // Utility functions that underly reality
//     d: function (n) {
//         return Math.floor(n * Math.random()) + 1;
//     }
// }

const SPELLS = { // Functions that alter reality.
    CrazyTiles: function (n) {
        let count = 0;
        let intervalid = setInterval(function () {
            const randomID = Util.d(GLOB.COUNT) - 1;
            const randomCell = Util.n2Cell(randomID);
            let randomdiv = document.getElementById(randomCell);
            // Utils.update_div_value(randomdiv, String(Util.d(7)));
            SPELLS.Increment(randomCell);
            Util.update_div_value(randomdiv);
            count++;
            if (count > n) clearInterval(intervalid);
        }, 50);
    },
    Increment: function (cellname) {
        let val = MAPS.cell2val.get(cellname);
        let numval = Number(val);
        if (numval)
            MAPS.cell2val.set(cellname, numval + 1);
        else
            MAPS.cell2val.set(cellname, 1);
    }
}
let stages = {
    reset: function () {
        MAPS.cell2val.forEach((val, key) => {
            MAPS.cell2val.set(key, key);
            Util.update_div_value(document.getElementById(key));
        });
    },
    // init: function () {
    //     let index = 0;
    //     let aPage: HTMLDivElement = document.querySelector(GLOB.container_div);
    //     const marg = 1; //0px
    //     aPage.innerHTML = "";
    //     aPage.style.width = `${(GLOB.TILEPX + marg) * GLOB.WIDTH}px`;
    //     aPage.style.height = `${(GLOB.TILEPX + marg) * GLOB.HEIGHT}px`;
    //     document.querySelector(GLOB.container_div)
    //     this.MAX = GLOB.HEIGHT * GLOB.WIDTH;

    //     for (let rows = 0; rows < GLOB.HEIGHT; rows++) {
    //         let row_wrapper = document.createElement('div');
    //         row_wrapper.id = "row_" + rows;
    //         aPage.append(row_wrapper)
    //         for (let cols = 0; cols < GLOB.WIDTH; cols++) {
    //             let cellname = Util.xy2Cell(cols, rows);
    //             let div = document.createElement('div');

    //             div.id = cellname;
    //             div.title = String(index);
    //             // div.tabIndex = 0;

    //             MAPS.id2cell.set(index, cellname);

    //             // MAPS.cell2val.set(cellname, 0);
    //             Util.update_div_value(div);
    //             row_wrapper.append(div)

    //             index++;
    //         }
    //     }
    //     console.log(this);
    // },
    randomshit: function (aGrid) {
        let d = function (n) {
            return Math.floor(n * Math.random()) + 1;
        }
        let count = 0;
        let intervalid = setInterval(function () {
            let randomdiv = document.querySelector("#" + Util.n2Cell(d(64), aGrid));
            Util.update_div_value(randomdiv, String(Util.d(7)));
            count++;
            if (count > 100) clearInterval(intervalid);
        }, 100);

    }
}

class Nav {
    static directions = function (id: number) {
        return {
            above: id - GLOB.WIDTH,
            below: id + GLOB.WIDTH,
            left: id - 1,
            right: id + 1
        }
    }
    static zDivrections = function (div: HTMLDivElement) {
        let id = Number(div.id.substring(1));
        return {
            above: id - GLOB.WIDTH,
            below: id + GLOB.WIDTH,
            left: id - 1,
            right: id + 1
        }
    }
}

function TurnOnButtons() {
    document.getElementById("b0").addEventListener("click", stages.reset);
    // document.getElementById("b1").addEventListener("click", aComp);
    document.getElementById("b2").addEventListener("click", SPELLS.CrazyTiles);
    // document.getElementById("b3").addEventListener("click", WriteNumber);
    (document.getElementById("b4") as HTMLButtonElement).value = "Play";
    document.getElementById("b4").addEventListener("click", musicalTesting);

}
import { Composition, Grid, Util } from "./Classes.js";
function stampNumber() {
    let pattern_1 = [
        "11.",
        ".1.",
        ".1.",
        ".1.",
        "111"
    ];
    let pattern_2 = [
        "222",
        "..2",
        ".2.",
        "2..",
        "222"
    ];
    let mainstage = new Composition("layer_2");
    let grod = Grid.fromAscii(pattern_1);
    let stamp = Grid.fromAscii(pattern_2);
    grod.useStamp(stamp);
}

function n2CellTesting(aComp: Composition) {
    let MAX = aComp.nWide * aComp.nTall;
    for (let i = 0; i < MAX; i++) {

        const randomCell = "bg_" + Util.n2Cell(i, aComp.bg);
        console.log("testing", i, randomCell);

    }
}

function CompositionTesting() {
    let comp = new Composition({ comptainer: "layer_bg", TILEPX: GLOB.TILEPX, SPACING: GLOB.SPACING, nWide: GLOB.WIDTH, nTall: GLOB.HEIGHT });
    comp.init();
    // comp.set_bg("B1", 5);
    // debugger;
    // comp.fill(0);
    comp.fillWithFunc(function () {
        return Util.d(10) == 1 ? 1 : 0;
    });
    comp.refresh();
    TurnOnButtons();
    // Util.setIntervalX(() => comp.miniRando(10), 0, 100);
    comp.miniRando(1000);
    // comp.gameOfLife();
    // n2CellTesting(comp);
}// CompositionTesting();

function musicalTesting() {
    let comp = new Composition({ comptainer: "layer_bg", TILEPX: GLOB.TILEPX, SPACING: GLOB.SPACING, nWide: GLOB.WIDTH, nTall: GLOB.HEIGHT });
    comp.init();
    // comp.set_bg("B1", 5);
    // debugger;
    comp.fill(-1);
    // comp.fillWithFunc(function () {
    //     return Util.d(10) == 1;
    // })
    comp.refresh();
    TurnOnButtons();

    let musicer = visualizer(comp);
    musicer.audio();
    // var audioCtx = new (window.AudioContext)();
    // var analyser = audioCtx.createAnalyser();
    // // source = audioCtx.createMediaStreamSource(stream);
    // // source.connect(analyser);
    // // analyser.connect(distortion);
    // // distortion.connect(audioCtx.destination);

    // analyser.fftSize = 2048;
    // var bufferLength = analyser.frequencyBinCount;
    // var dataArray = new Uint8Array(bufferLength);
};

TurnOnButtons();
window.onload = (event) => {
    console.log('page is fully loaded');
    Util.$id("b4").click();
}
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
let visualizer = function (aComp: Composition) {
    const WIDTH = 1500;
    const HEIGHT = 1500;
    const FFT_SIZE = 2 ** 10;
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    let analyzer: AnalyserNode;
    let bufferLength;

    function hslToRgb(h, s, l) {
        let r;
        let g;
        let b;

        if (s == -1) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
    function audio() {

        const audioCtx = new AudioContext();
        const audio = new Audio("passwordshow.wav");
        const source = audioCtx.createMediaElementSource(audio);

        source.connect(audioCtx.destination);
        analyzer = audioCtx.createAnalyser();
        audio.playbackRate = 1 / 2;
        analyzer.smoothingTimeConstant = .6;
        source.connect(analyzer);
        analyzer.fftSize = FFT_SIZE;
        // analyzer.maxDecibels = -45;
        analyzer.minDecibels = -75;
        audio.play();

        bufferLength = analyzer.frequencyBinCount;
        console.log("bufferlength", bufferLength);
        bufferLength = analyzer.frequencyBinCount;
        const timeData = new Uint8Array(bufferLength);
        const frequencyData = new Uint8Array(bufferLength);
        requestAnimationFrame(() => {
            // setTimeout(function () {
            analyzer.getByteTimeDomainData(timeData);
            analyzer.getByteFrequencyData(frequencyData);
            drawTimeData(timeData);
            drawFrequency(frequencyData);
            drawCompo(frequencyData);
            // }, 500)
        })
    }

    async function getAudio() {
        const stream = await navigator.mediaDevices
            .getUserMedia({ audio: true })
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);

        analyzer = audioCtx.createAnalyser();
        source.connect(analyzer);

        // How much data should we collect?
        analyzer.fftSize = FFT_SIZE;

        // pull the data off the audio
        // how many pieces of data are there?
        const timeData = new Uint8Array(bufferLength);
        const frequencyData = new Uint8Array(bufferLength);
        requestAnimationFrame(() => {
            // setTimeout(function () {
            // analyzer.getByteTimeDomainData(timeData);
            // analyzer.getByteFrequencyData(frequencyData);
            drawTimeData(timeData);
            drawFrequency(frequencyData);
            drawCompo(frequencyData);
            // }, 500)
        })
    }

    function drawTimeData(timeData) {
        // inject the time data into the time data array
        analyzer.getByteTimeDomainData(timeData);
        // now that we have the data, let's turn it into something visual
        // 1. clear the canvas
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        // 2. set up some canvas drawing
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#ffc600';
        ctx.beginPath();
        const sliceWidth = WIDTH / bufferLength;
        let x = 0;

        timeData.forEach((data, i) => {
            // multiplier in drawing the data
            const v = data / 128;
            // height of visualized data
            const y = (v * HEIGHT) / 2;
            // draw our lines
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            x += sliceWidth;
        });

        ctx.stroke();

        // call itself as soon as possible!
        requestAnimationFrame(() => drawTimeData(timeData));
    }
    function drawCompo(frequencyData) {
        analyzer.getByteFrequencyData(frequencyData);

        let count = 0;
        let dataEnd = 0;
        let iComp = 0;
        for (let index = 0; iComp < aComp.size(); index++) {
            const amount = frequencyData[index];
            let key = Util.n2Cell(iComp++);

            let val = Math.floor(amount / 255 * 100);
            aComp.set_bg(key, val);
        }
        // frequencyData.forEach(amount => {
        //     let key = Util.n2Cell(Math.floor(count));

        //     if (aComp.bg.map.has(key)) {
        //         let val = Math.floor(amount / 255 * 100);

        //         // if (val < 10) val *= 10;
        //         // debugger;
        //         // if (val > 20)
        //         aComp.set_bg(key, val);

        //         // if (val > 80)
        //         //     console.log(key, count);
        //         count++;
        //     }
        //     // aComp.decrement(key);

        // })

        requestAnimationFrame(() => {
            aComp.refresh();
            //     // for (const key in aComp.bg.map.keys()) {
            //     //     aComp.decrement(key);
            //     // }
            drawCompo(frequencyData);
        });
    }
    function drawFrequency(frequencyData) {
        // get the frequency data into our frequencyData array
        analyzer.getByteFrequencyData(frequencyData);

        // figure out the bar width
        const barWidth = (WIDTH / bufferLength) * 5.5;
        let x = 0;
        frequencyData.forEach(amount => {
            // frequency data comes in from 0 - 255
            const percent = amount / 255; // 0 - 100%
            const [h, s, l] = [percent, 0.8, 0.5];
            const barHeight = (HEIGHT * percent) / 2;
            // convert the color to HSL
            const [r, g, b] = hslToRgb(h, s, l);
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
            x += barWidth;
        });

        requestAnimationFrame(() => {
            drawFrequency(frequencyData)
        });
    }
    return { getAudio, audio };
}
// let test = visualizer();
// test.getAudio();
// musicalTesting();