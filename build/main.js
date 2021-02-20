let GLOBALS = {
    ROWS: 8,
    COLS: 8,
    TILEPX: 23,
    container_div: "#grid_container"
};
let stages = {
    init: function () {
        let index = 1;
        let aPage = document.querySelector(GLOBALS.container_div);
        aPage.innerHTML = "";
        this.MAX = GLOBALS.ROWS * GLOBALS.COLS;
        this.count = 0;
        this.divpool = new Map();
        for (let rows = 0; rows < GLOBALS.ROWS; rows++) {
            for (let cols = 0; cols < GLOBALS.COLS; cols++) {
                let cellname = Utils.xy2Cell(cols, rows + 1);
                let div = document.createElement('div');
                div.id = cellname;
                div.title = String(index);
                div.tabIndex = 0;
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
            Utils.update_div_value(randomdiv, d(7));
            count++;
            if (count > 100)
                clearInterval(intervalid);
        }, 100);
    }
};
class Utils {
    static clearIntervals() {
    }
    static update_div_value(div, val = undefined) {
        const cellname = div.title;
        if (val === undefined) {
            div.innerHTML = div.title;
            div.className = "tile";
            return;
        }
        let value = val;
        if (value === undefined)
            value = -1;
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
            currentcell += GLOBALS.COLS;
        }
        console.log("Done...", result);
        return result;
    }
}
Utils.numToAbc = function (num) {
    const alphabet = "abcdefghijklmnopqrstuvqxyz";
    const len = alphabet.length;
    if (num < len || num < 0)
        return alphabet.charAt(num);
    console.log("num2abcfail", num);
    return "null";
};
Utils.xy2Cell = function (x, y) {
    return Utils.numToAbc(x).toUpperCase() + y;
};
Utils.n2Cell = function (n) {
    let col = Math.floor(n / GLOBALS.COLS);
    let row = n % col;
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
        above: id - GLOBALS.COLS,
        below: id + GLOBALS.COLS,
        left: id - 1,
        right: id + 1
    };
};
Nav.zDivrections = function (div) {
    let id = Number(div.id.substring(1));
    return {
        above: id - GLOBALS.COLS,
        below: id + GLOBALS.COLS,
        left: id - 1,
        right: id + 1
    };
};
function BuildGrid() {
    document.documentElement.style.setProperty('--tileSize', GLOBALS.TILEPX + 'px');
    document.documentElement.style.setProperty('--totalWidth', GLOBALS.COLS * (GLOBALS.TILEPX + 2) + 'px');
    stages.init();
}
;
function WriteNumber() {
    let startcell = 0;
    let results = Utils.ascii2CellList();
    results.forEach(element => {
        Utils.update_div_value(document.querySelector("#" + element), 1);
    });
}
BuildGrid();
WriteNumber();
