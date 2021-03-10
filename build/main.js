var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let h = 8;
let w = 8;
const GLOB = {
    HEIGHT: h,
    WIDTH: w,
    COUNT: h * w,
    REFGRID: new Grid(w, h),
    TILEPX: 16,
    SPACING: 0,
    container_div: "#layer_bg",
    LOWER: "abcdefghijklmnopqrstuvqxyz",
    UPPER: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
};
const MAPS = {
    id2cell: new Map(),
    cell2val: new Map()
};
const SPELLS = {
    CrazyTiles: function (n) {
        let count = 0;
        let intervalid = setInterval(function () {
            const randomID = Util.d(GLOB.COUNT) - 1;
            const randomCell = Util.n2Cell(randomID);
            let randomdiv = document.getElementById(randomCell);
            SPELLS.Increment(randomCell);
            Util.update_div_value(randomdiv);
            count++;
            if (count > n)
                clearInterval(intervalid);
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
};
let stages = {
    reset: function () {
        MAPS.cell2val.forEach((val, key) => {
            MAPS.cell2val.set(key, key);
            Util.update_div_value(document.getElementById(key));
        });
    },
    randomshit: function (aGrid) {
        let d = function (n) {
            return Math.floor(n * Math.random()) + 1;
        };
        let count = 0;
        let intervalid = setInterval(function () {
            let randomdiv = document.querySelector("#" + Util.n2Cell(d(64), aGrid));
            Util.update_div_value(randomdiv, String(Util.d(7)));
            count++;
            if (count > 100)
                clearInterval(intervalid);
        }, 100);
    }
};
class Nav {
}
Nav.directions = function (id) {
    return {
        above: id - GLOB.WIDTH,
        below: id + GLOB.WIDTH,
        left: id - 1,
        right: id + 1
    };
};
Nav.zDivrections = function (div) {
    let id = Number(div.id.substring(1));
    return {
        above: id - GLOB.WIDTH,
        below: id + GLOB.WIDTH,
        left: id - 1,
        right: id + 1
    };
};
function TurnOnButtons() {
    document.getElementById("b0").addEventListener("click", stages.reset);
    document.getElementById("b2").addEventListener("click", SPELLS.CrazyTiles);
    document.getElementById("b4").value = "Play";
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
function n2CellTesting(aComp) {
    let MAX = aComp.nWide * aComp.nTall;
    for (let i = 0; i < MAX; i++) {
        const randomCell = "bg_" + Util.n2Cell(i, aComp.bg);
        console.log("testing", i, randomCell);
    }
}
function CompositionTesting() {
    let comp = new Composition({ comptainer: "layer_bg", TILEPX: GLOB.TILEPX, SPACING: GLOB.SPACING, nWide: GLOB.WIDTH, nTall: GLOB.HEIGHT });
    comp.init();
    comp.fillWithFunc(function () {
        return Util.d(10) == 1 ? 1 : 0;
    });
    comp.refresh();
    TurnOnButtons();
    comp.miniRando(1000);
}
function musicalTesting() {
    let comp = new Composition({ comptainer: "layer_bg", TILEPX: GLOB.TILEPX, SPACING: GLOB.SPACING, nWide: GLOB.WIDTH, nTall: GLOB.HEIGHT });
    comp.init();
    comp.fill(-1);
    comp.refresh();
    TurnOnButtons();
    let musicer = visualizer(comp);
    musicer.audio();
}
;
TurnOnButtons();
window.onload = (event) => {
    console.log('page is fully loaded');
    Util.$id("b4").click();
};
let visualizer = function (aComp) {
    const WIDTH = 1500;
    const HEIGHT = 1500;
    const FFT_SIZE = Math.pow(2, 10);
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    let analyzer;
    let bufferLength;
    function hslToRgb(h, s, l) {
        let r;
        let g;
        let b;
        if (s == -1) {
            r = g = b = l;
        }
        else {
            const hue2rgb = function hue2rgb(p, q, t) {
                if (t < 0)
                    t += 1;
                if (t > 1)
                    t -= 1;
                if (t < 1 / 6)
                    return p + (q - p) * 6 * t;
                if (t < 1 / 2)
                    return q;
                if (t < 2 / 3)
                    return p + (q - p) * (2 / 3 - t) * 6;
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
        analyzer.minDecibels = -75;
        audio.play();
        bufferLength = analyzer.frequencyBinCount;
        console.log("bufferlength", bufferLength);
        bufferLength = analyzer.frequencyBinCount;
        const timeData = new Uint8Array(bufferLength);
        const frequencyData = new Uint8Array(bufferLength);
        requestAnimationFrame(() => {
            analyzer.getByteTimeDomainData(timeData);
            analyzer.getByteFrequencyData(frequencyData);
            drawTimeData(timeData);
            drawFrequency(frequencyData);
            drawCompo(frequencyData);
        });
    }
    function getAudio() {
        return __awaiter(this, void 0, void 0, function* () {
            const stream = yield navigator.mediaDevices
                .getUserMedia({ audio: true });
            const audioCtx = new AudioContext();
            const source = audioCtx.createMediaStreamSource(stream);
            analyzer = audioCtx.createAnalyser();
            source.connect(analyzer);
            analyzer.fftSize = FFT_SIZE;
            const timeData = new Uint8Array(bufferLength);
            const frequencyData = new Uint8Array(bufferLength);
            requestAnimationFrame(() => {
                drawTimeData(timeData);
                drawFrequency(frequencyData);
                drawCompo(frequencyData);
            });
        });
    }
    function drawTimeData(timeData) {
        analyzer.getByteTimeDomainData(timeData);
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#ffc600';
        ctx.beginPath();
        const sliceWidth = WIDTH / bufferLength;
        let x = 0;
        timeData.forEach((data, i) => {
            const v = data / 128;
            const y = (v * HEIGHT) / 2;
            if (i === 0) {
                ctx.moveTo(x, y);
            }
            else {
                ctx.lineTo(x, y);
            }
            x += sliceWidth;
        });
        ctx.stroke();
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
        requestAnimationFrame(() => {
            aComp.refresh();
            drawCompo(frequencyData);
        });
    }
    function drawFrequency(frequencyData) {
        analyzer.getByteFrequencyData(frequencyData);
        const barWidth = (WIDTH / bufferLength) * 5.5;
        let x = 0;
        frequencyData.forEach(amount => {
            const percent = amount / 255;
            const [h, s, l] = [percent, 0.8, 0.5];
            const barHeight = (HEIGHT * percent) / 2;
            const [r, g, b] = hslToRgb(h, s, l);
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
            x += barWidth;
        });
        requestAnimationFrame(() => {
            drawFrequency(frequencyData);
        });
    }
    return { getAudio, audio };
};
//# sourceMappingURL=main.js.map