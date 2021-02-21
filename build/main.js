const GLOB = {
    HEIGHT: 30,
    WIDTH: 20,
    COUNT: 30 * 20,
    TILEPX: 22,
    container_div: "#grid_container",
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
    CrazyTiles: function (n = 50) {
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
    init: function () {
        let index = 0;
        let aPage = document.querySelector(GLOB.container_div);
        const marg = 0;
        aPage.innerHTML = "";
        aPage.style.width = `${(GLOB.TILEPX + marg) * GLOB.WIDTH}px`;
        aPage.style.height = `${(GLOB.TILEPX + marg) * GLOB.HEIGHT}px`;
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
                div.tabIndex = 0;
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
    static clearIntervals() {
    }
    static update_div_value(div, val = "default") {
        const cellname = div.id;
        if (val === "default") {
            val = MAPS.cell2val.get(cellname);
        }
        div.innerHTML = String(val);
        if (div.innerHTML.length === 0
            || div.innerHTML === "undefined") {
            div.innerHTML = div.id;
        }
        div.className = "tile level" + val;
    }
    static isNull(element) {
        return element === undefined;
    }
    static isDefined(element) {
        return !Utils.isNull(element);
    }
    static ascii2CellList(iStart = new Loc(0, 0), iAscii = ["_1"]) {
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
class Loc {
    constructor(x = 0, y = 0) {
        this.x = x;
        if (this.x > GLOB.WIDTH)
            this.x -= GLOB.WIDTH;
        this.y = y;
        if (this.y > GLOB.HEIGHT)
            this.y -= GLOB.HEIGHT;
    }
    static new_fromCell(cellname) {
        let regresult = cellname.match(/([A-Z]+)(\d+)/);
        let x = Utils.abc2Num(regresult[1]);
        let y = Number(regresult[2]);
        let objresult = new Loc(x, y);
        console.log(regresult);
        console.log(objresult);
        return objresult;
    }
    static new_fromIndex(n) {
        return Loc.new_fromCell(Utils.n2Cell(n));
    }
    getCellname() {
        return Utils.xy2Cell(this.x, this.y);
    }
    getIndex() {
        return this.x + this.y * GLOB.WIDTH;
    }
    shiftIndex(n = 1) {
        return Loc.new_fromIndex(this.getIndex() + n);
    }
    shiftY(n = 1) { return new Loc(this.x, this.y + n); }
    ;
    shiftX(n = 1) { return new Loc(this.x + n, this.y + n); }
    ;
}
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
function WriteNumber(start) {
    let startcell = 0;
    let results = Utils.ascii2CellList(new Loc(3, 3), ["_1"]);
    results.forEach(element => {
        Utils.update_div_value(document.querySelector("#" + element), "1");
    });
}
BuildGrid();
WriteNumber(new Loc(3, 3));
