import { Grid, Loc } from "./Classes.js";
export default class Util {
    static incrementMap(map, key) {
        map.set(key, map.get(key) + 1);
    }
    static decrementMap(map, key) {
        map.set(key, map.get(key) - 1);
    }
    static d(n) {
        return Math.floor(n * Math.random()) + 1;
    }
    static mapToObj(map) {
        const obj = {};
        for (let [k, v] of map)
            obj[k] = v;
        return obj;
    }
    static $(arg) {
        return document.querySelector(arg);
    }
    static $id(arg) {
        return document.getElementById(arg);
    }
    static isNull(element) {
        return element === undefined;
    }
    static isDefined(element) {
        return !Util.isNull(element);
    }
    static ascii2CellList(iStart = Loc.new_fromGrid(new Grid(3, 3), 0, 0), iAscii = ["_1"]) {
        let start = iStart;
        let vOffset = start.x;
        let hOffset = start.y;
        let pattern_1 = [
            "110",
            "010",
            "010",
            "010",
            "111"
        ];
        let ascii = iAscii;
        if (ascii[0] === "_1")
            ascii = pattern_1;
        let currentcell = start;
        let result = [];
        for (let i = 0; i < ascii.length; i++) {
            const line = ascii[i];
            for (let nChar = 0; nChar < line.length; nChar++) {
                const element = line[nChar];
                if (element === "1") {
                    result.push(Util.xy2Cell(nChar + hOffset, i + vOffset));
                }
                currentcell.shiftIndex(1);
            }
            currentcell.shiftIndex(Util.GLOB.WIDTH);
        }
        console.log("Done...", result);
        return result;
    }
    static setIntervalX(callback, delay, repetitions) {
        var x = 0;
        var intervalID = window.setInterval(function () {
            callback();
            if (++x === repetitions) {
                window.clearInterval(intervalID);
            }
        }, delay);
    }
    static cyclemanager(func, hz, count) {
        let cycle = 0;
        let stopperid = setInterval(function () {
            if (cycle >= count) {
                clearInterval(intervalid);
                clearInterval(stopperid);
            }
            cycle++;
        }, hz);
        let intervalid = setInterval(func, hz);
    }
    static timesomething(func) {
        const t0 = performance.now();
        func();
        const t1 = performance.now();
        console.log(`Call to ${func} took ${t1 - t0} milliseconds.`);
    }
    static round(number, decimalPlaces) {
        return Number(Math.round(Number(number + "e" + decimalPlaces)) + "e-" + decimalPlaces);
    }
    static arraySummary(array) {
        let result = "";
        let max = 0;
        let min = 0;
        let mean = 0;
        let positive = true;
        let cycles = 0;
        let tally = 0;
        let imin = 0;
        let imax = 0;
        for (let i = 0; i < array.length; i++) {
            let element = array[i];
            tally += element;
            if (i % Math.floor(array.length / 10) == 0) {
                result += i + ":" + Math.round(tally / 10) + "\n";
                tally = 0;
            }
            mean += element;
            if (element > max) {
                imax = i;
                max = element;
            }
            if (element < min) {
                imin = i;
                min = element;
            }
            if (element < 0) {
                if (positive) {
                    cycles += 0.5;
                }
                positive = false;
            }
            if (element > 0) {
                if (!positive) {
                    cycles += 0.5;
                }
                positive = true;
            }
        }
        mean = mean / array.length;
        console.log("--- Measure array ---\n" + `min:(${imin},${min})`, "mean", mean, `max:(${imax},${max})`, "\ncycles:" + cycles, "Guess=" + Math.round(cycles * 1.46484375 * 2));
        console.log("array:\n" + result);
    }
    static out(contents) {
        let textarea = Util.$(Util.outtarget);
        let zeros = "000".substring(Util.outcount.toString().length);
        textarea.value += "\n" + zeros + Util.outcount + ":" + contents;
        textarea.scrollTop = textarea.scrollHeight;
        Util.outcount++;
    }
}
Util.outtarget = "#out";
Util.outcount = 0;
Util.audio = {
    hslToRgb: function (h, s, l) {
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
};
Util.GLOB = {
    HEIGHT: 30,
    WIDTH: 20,
    COUNT: 30 * 20,
    REFGRID: new Grid(8, 8),
    TILEPX: 24,
    container_div: "#layer_bg",
    LOWER: "abcdefghijklmnopqrstuvqxyz",
    UPPER: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
};
Util.num2Abc = function (num) {
    const len = Util.GLOB.UPPER.length;
    if (num < len && num >= 0)
        return Util.GLOB.UPPER.charAt(num);
    if (num >= len) {
        let next = Math.floor(num / len) - 1;
        return Util.num2Abc(next) + Util.GLOB.UPPER.charAt(num % len);
    }
    console.log("num2abcfail", num);
    return "null";
};
Util.abc2Num = function (abc) {
    if (!(typeof abc === "string"))
        return abc + "=not a string";
    abc = abc.toUpperCase();
    if (abc.length === 1)
        return Util.GLOB.UPPER.indexOf(abc);
    if (abc.length === 2)
        return Util.GLOB.UPPER.length + Util.abc2Num(abc.substring(1));
    if (abc.length === 3)
        return Util.GLOB.UPPER.length + Util.abc2Num(abc.substring(2));
    console.log("error in abc2Num");
    return -1;
};
Util.xy2Cell = function (x, y) {
    return Util.num2Abc(x).toUpperCase() + y;
};
Util.n2Xy = function (n, aGrid = Util.GLOB.REFGRID) {
    return [Math.floor(n % aGrid.cols), Math.floor(n / aGrid.cols)];
};
Util.n2Cell = function (n, aGrid = Util.GLOB.REFGRID) {
    let [x, y] = Util.n2Xy(n, aGrid);
    return Util.xy2Cell(x, y);
};
Util.cell2Xy = function (cellname, aGrid = Util.GLOB.REFGRID) {
    if (typeof cellname != "string") {
        console.error("ERROR BAD CELL NAME:", cellname);
    }
    let regresult = cellname.match(/([A-Z]+)(\d+)/);
    let x = Util.abc2Num(regresult[1]);
    let y = Number(regresult[2]);
    return [x, y];
};
Util.cell2n = function (cellname, aGrid = Util.GLOB.REFGRID) {
    let [x, y] = Util.cell2Xy(cellname, aGrid);
    return x + y * aGrid.cols;
};
Util.toFixedLength = function (input, length, padding) {
    padding = padding || "0";
    if (length <= 0) {
        let b = -1 * length;
        return (input + padding.repeat(b - input.length).slice(-b));
    }
    return (padding.repeat(length) + input).slice(-length);
};
Util.clean = function (element) {
    element.classList.remove('tileHighlight');
    element.style = "huh";
};
//# sourceMappingURL=Util.js.map