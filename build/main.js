const GLOB = {
    ROWS: 8,
    COLS: 8,
    TILEPX: 23,
    container_div: "#grid_container",
};
const FUN = {
    d: function (n) {
        return Math.floor(n * Math.random()) + 1;
    }
};
const MAPS = {
    id2cell: new Map(),
    cell2text: new Map()
};
const SPELLS = {
    CrazyTiles: function () {
        let count = 0;
        let intervalid = setInterval(function () {
            const randomID = FUN.d(64) - 1;
            const randomCell = Utils.n2Cell(randomID);
            let randomdiv = document.getElementById(randomCell);
            Utils.update_div_value(randomdiv, String(FUN.d(7)));
            count++;
            if (count > 14)
                clearInterval(intervalid);
        }, 50);
    }
};
let stages = {
    init: function () {
        let index = 0;
        let aPage = document.querySelector(GLOB.container_div);
        aPage.innerHTML = "";
        this.MAX = GLOB.ROWS * GLOB.COLS;
        this.count = 0;
        this.divpool = new Map();
        for (let rows = 0; rows < GLOB.ROWS; rows++) {
            for (let cols = 0; cols < GLOB.COLS; cols++) {
                let cellname = Utils.xy2Cell(cols, rows);
                let div = document.createElement('div');
                div.id = cellname;
                div.title = String(index);
                div.tabIndex = 0;
                MAPS.id2cell.set(index, cellname);
                MAPS.cell2text.set(cellname, cellname);
                Utils.update_div_value(div);
                aPage.append(div);
                this.divpool.set(cellname, div);
                index++;
                this.count++;
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
    static clearIntervals() {
    }
    static update_div_value(div, val = "empty") {
        const cellname = div.id;
        if (val === "empty") {
            div.innerHTML = MAPS.cell2text.get(cellname);
            div.className = "tile";
            if (div.innerHTML.length === 0)
                div.innerHTML = div.title;
            return;
        }
        let value = val;
        if (value === undefined)
            value = "-1";
        div.innerHTML = String(value);
        div.className = "tile level" + value;
    }
    static isNull(element) {
        return element === undefined;
    }
    static isDefined(element) {
        return !Utils.isNull(element);
    }
    static ascii2CellList() {
        let startingcell = 0;
        let currentcell = startingcell;
        let ascii = [
            "11100",
            "00100",
            "00100",
            "00100",
            "11111"
        ];
        let result = [];
        for (let i = 0; i < ascii.length; i++) {
            const line = ascii[i];
            for (let nChar = 0; nChar < line.length; nChar++) {
                const element = line[nChar];
                console.log(element);
                if (element === "1") {
                    result.push(Utils.xy2Cell(nChar, i + 1));
                }
                currentcell++;
            }
            currentcell += GLOB.COLS;
        }
        console.log("Done...", result);
        return result;
    }
}
Utils.numToAbc = function (num) {
    const alphabet = "abcdefghijklmnopqrstuvqxyz";
    const len = alphabet.length;
    if (num < len &&
        num >= 0)
        return alphabet.charAt(num);
    console.log("num2abcfail", num);
    return "null";
};
Utils.xy2Cell = function (x, y) {
    return Utils.numToAbc(x).toUpperCase() + y;
};
Utils.n2Cell = function (n) {
    let maptemp = MAPS.id2cell.get(n);
    if (maptemp !== undefined)
        return maptemp;
    let col = Math.floor(n / GLOB.COLS);
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
        above: id - GLOB.COLS,
        below: id + GLOB.COLS,
        left: id - 1,
        right: id + 1
    };
};
Nav.zDivrections = function (div) {
    let id = Number(div.id.substring(1));
    return {
        above: id - GLOB.COLS,
        below: id + GLOB.COLS,
        left: id - 1,
        right: id + 1
    };
};
function BuildGrid() {
    document.documentElement.style.setProperty('--tileSize', GLOB.TILEPX + 'px');
    document.documentElement.style.setProperty('--totalWidth', GLOB.COLS * (GLOB.TILEPX + 2) + 'px');
    stages.init();
}
;
function WriteNumber() {
    let startcell = 0;
    let results = Utils.ascii2CellList();
    results.forEach(element => {
        Utils.update_div_value(document.querySelector("#" + element), "1");
    });
}
BuildGrid();
WriteNumber();
