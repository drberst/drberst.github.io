/*
1. Global vars
2. collections of data
3. collections of functions
4. Using pieces 1-3 for stage 2 complexity
5. Assembling into final complexity
*/


const GLOB = {
    HEIGHT: 30, //Height / Y
    WIDTH: 20, //Width  / X
    COUNT: 30 * 20,
    TILEPX: 22,
    container_div: "#grid_container",
    LOWER: "abcdefghijklmnopqrstuvqxyz",
    UPPER: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
}
const MAPS = {
    id2cell: new Map(),
    cell2val: new Map()
}
const FUN = {
    d: function (n) {
        return Math.floor(n * Math.random()) + 1;
    }
}

const SPELLS = {
    CrazyTiles: function (n = 50) {
        let count = 0;
        let intervalid = setInterval(function () {
            const randomID = FUN.d(GLOB.COUNT) - 1;
            const randomCell = Utils.n2Cell(randomID);
            let randomdiv = document.getElementById(randomCell);
            // Utils.update_div_value(randomdiv, String(FUN.d(7)));
            SPELLS.Increment(randomCell);
            Utils.update_div_value(randomdiv);
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
    init: function () {
        let index = 0;
        let aPage: HTMLDivElement = document.querySelector(GLOB.container_div);
        const marg = 0; //0px
        aPage.innerHTML = "";
        aPage.style.width = `${(GLOB.TILEPX + marg) * GLOB.WIDTH}px`;
        aPage.style.height = `${(GLOB.TILEPX + marg) * GLOB.HEIGHT}px`;

        this.MAX = GLOB.HEIGHT * GLOB.WIDTH;

        for (let rows = 0; rows < GLOB.HEIGHT; rows++) {
            let row_wrapper = document.createElement('div');
            row_wrapper.id = "row_" + rows;
            aPage.append(row_wrapper)
            for (let cols = 0; cols < GLOB.WIDTH; cols++) {
                let cellname = Utils.xy2Cell(cols, rows);
                let div = document.createElement('div');

                div.id = cellname;
                div.title = String(index);
                div.tabIndex = 0;

                MAPS.id2cell.set(index, cellname);

                // MAPS.cell2val.set(cellname, 0);
                Utils.update_div_value(div);
                row_wrapper.append(div)

                index++;
            }
        }
        console.log(this);
    },
    randomshit: function () {
        let d = function (n) {
            return Math.floor(n * Math.random()) + 1;
        }
        let count = 0;
        let intervalid = setInterval(function () {
            let randomdiv = document.querySelector("#" + Utils.n2Cell(d(64)));
            Utils.update_div_value(randomdiv, String(FUN.d(7)));
            count++;
            if (count > 100) clearInterval(intervalid);
        }, 100);

    }
}
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
        // if (Number(val) >= 0 && Number(val) <= 8) div.className = "tile level" + val;
        // animateandqueueremoval(div);
    }
    static num2Abc = function (num) {
        // const alphabet = "abcdefghijklmnopqrstuvqxyz";
        const len = GLOB.UPPER.length;

        if (num < len && num >= 0) return GLOB.UPPER.charAt(num);
        if (num - 26 >= 0) return GLOB.UPPER.charAt(num - 26) + Utils.num2Abc(num - 26);
        console.log("num2abcfail", num)
        return "null";
    }
    static abc2Num = function (abc) {
        // const GLOB.UPPER = "abcdefghijklmnopqrstuvqxyz";
        abc = abc.toUpperCase();
        if (abc.length === 1) return GLOB.UPPER.indexOf(abc);
        // if (abc.length === 2) return GLOB.UPPER.indexOf(abc.charAt(0)) + GLOB.UPPER.indexOf(abc.charAt(1))

        console.log("error in abc2Num");
        return -1;
    }
    static cell2XY = function (cellname) {

    }
    static xy2Cell = function (x, y) {
        return Utils.num2Abc(x).toUpperCase() + y;
    }
    static n2Cell = function (n) {
        let maptemp = MAPS.id2cell.get(n);
        if (maptemp !== undefined) return maptemp;
        let col = Math.floor(n / GLOB.WIDTH);
        let row = (col > 0) ? n % col : n;
        return Utils.xy2Cell(row, col);
    }
    static toFixedLength = function (input, length, padding?) {
        padding = padding || "0";

        if (length <= 0) {
            let b = -1 * length;
            return (input + padding.repeat(b - input.length).slice(-b));
        }
        return (padding.repeat(length) + input).slice(-length);
    }

    static clean = function (element) {
        element.classList.remove('tileHighlight');
        element.style = "huh";
        // console.log("done cleaning",element);
    }

    static isNull(element) {
        return element === undefined;
    }
    static isDefined(element) {
        return !Utils.isNull(element);
    }

    static ascii2CellList(options) {
        let startingcell = 0;
        let currentcell = startingcell;
        let vOffset = options.x ? options.x : 0;
        let hOffset = 0;
        let ascii = [
            "110",
            "010",
            "010",
            "010",
            "111"
        ]
        let result = [];
        for (let i = 0; i < ascii.length; i++) {
            const line = ascii[i];

            for (let nChar = 0; nChar < line.length; nChar++) {
                const element = line[nChar];
                console.log(element);

                if (element === "1") {
                    result.push(Utils.xy2Cell(nChar + hOffset, i + vOffset));
                }
                currentcell++;
            }
            currentcell += GLOB.WIDTH;
        }
        console.log("Done...", result)
        return result;
    }
}
class Loc {
    x: number;
    y: number;
    index: number;
    cellname: string;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    static fromCell(cellname) {
        let regresult = cellname.match(/([A-Z]+)(\d+)/)
        let x = Utils.abc2Num(regresult[1])
        let y = Number(regresult[2]);
        let objresult = new Loc(x, y);
        console.log(regresult)
        console.log(objresult)

        return objresult;
    }

    getCellname() {
        return Utils.xy2Cell(this.x, this.y);
    }
    getIndex() {
        return this.x + this.y * GLOB.WIDTH;
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
function BuildGrid() {
    document.documentElement.style.setProperty('--tileSize', GLOB.TILEPX + 'px');
    document.documentElement.style.setProperty('--totalWidth', GLOB.WIDTH * (GLOB.TILEPX + 2) + 'px');
    stages.init();
    // stages.randomshit();
};

function WriteNumber() {
    let startcell = 0;
    let results = Utils.ascii2CellList();
    results.forEach(element => {
        Utils.update_div_value(document.querySelector("#" + element), "1");
    });
}
BuildGrid();
// SPELLS.CrazyTiles(1000);
WriteNumber();