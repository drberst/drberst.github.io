const GLOB = {
    HEIGHT: 8,
    WIDTH: 16,
    COUNT: 8 * 16,
    TILEPX: 22,
    container_div: "#layer_bg",
    LOWER: "abcdefghijklmnopqrstuvqxyz",
    UPPER: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
};
const MAPS = {
    id2cell: new Map(),
    cell2val: new Map()
};
const FUN = {
    d: function (n) {
        return Math.floor(n * Math.random()) + 1;
    }
};
const SPELLS = {
    CrazyTiles: function (n) {
        let count = 0;
        let intervalid = setInterval(function () {
            const randomID = FUN.d(GLOB.COUNT) - 1;
            const randomCell = Utils.n2Cell(randomID);
            let randomdiv = document.getElementById(randomCell);
            SPELLS.Increment(randomCell);
            Utils.update_div_value(randomdiv);
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
            Utils.update_div_value(document.getElementById(key));
        });
    },
    init: function () {
        let index = 0;
        let aPage = document.querySelector(GLOB.container_div);
        const marg = 1;
        aPage.innerHTML = "";
        aPage.style.width = `${(GLOB.TILEPX + marg) * GLOB.WIDTH}px`;
        aPage.style.height = `${(GLOB.TILEPX + marg) * GLOB.HEIGHT}px`;
        document.querySelector(GLOB.container_div);
        this.MAX = GLOB.HEIGHT * GLOB.WIDTH;
        for (let rows = 0; rows < GLOB.HEIGHT; rows++) {
            let row_wrapper = document.createElement('div');
            row_wrapper.id = "row_" + rows;
            aPage.append(row_wrapper);
            for (let cols = 0; cols < GLOB.WIDTH; cols++) {
                let cellname = Utils.xy2Cell(cols, rows);
                let div = document.createElement('div');
                div.id = cellname;
                div.title = String(index);
                MAPS.id2cell.set(index, cellname);
                Utils.update_div_value(div);
                row_wrapper.append(div);
                index++;
            }
        }
        console.log(this);
    },
    randomshit: function () {
        let d = function (n) {
            return Math.floor(n * Math.random()) + 1;
        };
        let count = 0;
        let intervalid = setInterval(function () {
            let randomdiv = document.querySelector("#" + Utils.n2Cell(d(64)));
            Utils.update_div_value(randomdiv, String(FUN.d(7)));
            count++;
            if (count > 100)
                clearInterval(intervalid);
        }, 100);
    }
};
class Utils {
    static update_div_value(div, val = "default") {
        const cellname = div.id;
        if (val === "default") {
            val = MAPS.cell2val.get(cellname);
        }
        else {
            MAPS.cell2val.set(cellname, val);
        }
        div.innerHTML = String(val);
        if (div.innerHTML.length === 0
            || div.innerHTML === "undefined") {
            div.innerHTML = div.id;
        }
        let regresult = cellname.match(/([A-Z]+)(\d+)/);
        let letter = regresult[1];
        let number = Number(regresult[2]);
        div.innerHTML = letter + `<sub style="font-size: 67%">${number}</sub>`;
        div.className = "tile level" + val;
    }
    static isNull(element) {
        return element === undefined;
    }
    static isDefined(element) {
        return !Utils.isNull(element);
    }
    static ascii2CellList(iStart = new Loc(new Grid(3, 3), 0, 0), iAscii = ["_1"]) {
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
                console.log(element);
                if (element === "1") {
                    result.push(Utils.xy2Cell(nChar + hOffset, i + vOffset));
                }
                currentcell.shiftIndex(1);
            }
            currentcell.shiftIndex(GLOB.WIDTH);
        }
        console.log("Done...", result);
        return result;
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
}
Utils.num2Abc = function (num) {
    const len = GLOB.UPPER.length;
    if (num < len && num >= 0)
        return GLOB.UPPER.charAt(num);
    if (num - 26 >= 0)
        return GLOB.UPPER.charAt(num - 26) + Utils.num2Abc(num - 26);
    console.log("num2abcfail", num);
    return "null";
};
Utils.abc2Num = function (abc) {
    abc = abc.toUpperCase();
    if (abc.length === 1)
        return GLOB.UPPER.indexOf(abc);
    console.log("error in abc2Num");
    return -1;
};
Utils.cell2XY = function (cellname) {
};
Utils.xy2Cell = function (x, y) {
    return Utils.num2Abc(x).toUpperCase() + y;
};
Utils.n2Cell = function (n) {
    let maptemp = MAPS.id2cell.get(n);
    if (maptemp !== undefined)
        return maptemp;
    let col = Math.floor(n / GLOB.WIDTH);
    let row = (col > 0) ? n % col : n;
    return Utils.xy2Cell(row, col);
};
Utils.toFixedLength = function (input, length, padding) {
    padding = padding || "0";
    if (length <= 0) {
        let b = -1 * length;
        return (input + padding.repeat(b - input.length).slice(-b));
    }
    return (padding.repeat(length) + input).slice(-length);
};
Utils.clean = function (element) {
    element.classList.remove('tileHighlight');
    element.style = "huh";
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
function BuildGrid() {
    document.documentElement.style.setProperty('--tileSize', GLOB.TILEPX + 'px');
    document.documentElement.style.setProperty('--totalWidth', GLOB.WIDTH * (GLOB.TILEPX + 2) + 'px');
    stages.init();
}
;
function WriteNumber() {
    console.log("writenumber");
    let pattern_1 = [
        "11.",
        ".1.",
        ".1.",
        ".1.",
        "111"
    ];
    let mainstage = new Scene("layer_1");
    let grod = Grid.fromAscii(pattern_1);
    mainstage.addDiv("grod");
    mainstage.addGrid(grod, "grod");
    let maingrid = mainstage.list_gridElements[0];
    mainstage.print("layer_1");
}
function miniRando() {
    const randomID = FUN.d(GLOB.COUNT) - 1;
    const randomCell = Utils.n2Cell(randomID);
    let randomdiv = document.getElementById(randomCell);
    SPELLS.Increment(randomCell);
    Utils.update_div_value(randomdiv);
}
function Automata() {
    Utils.cyclemanager(miniRando, 1000, 300);
}
function TurnOnButtons() {
    document.getElementById("b0").addEventListener("click", stages.reset);
    document.getElementById("b1").addEventListener("click", BuildGrid);
    document.getElementById("b2").addEventListener("click", SPELLS.CrazyTiles);
    document.getElementById("b3").addEventListener("click", WriteNumber);
    document.getElementById("b4").value = "StampNumber";
    document.getElementById("b4").addEventListener("click", stampNumber);
}
;
import { Scene } from "./Classes.js";
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
    let mainstage = new Scene("layer_2");
    let grod = Grid.fromAscii(pattern_1);
    let stamp = Grid.fromAscii(pattern_2);
    grod.useStamp(stamp);
    mainstage.addDiv("grod");
    mainstage.addGrid(grod, "grod");
    let maingrid = mainstage.list_gridElements[0];
    mainstage.print("layer_2");
}
export { Utils };
import { Grid, Loc } from "./Classes.js";
BuildGrid();
TurnOnButtons();
