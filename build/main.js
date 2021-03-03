6;
const GLOB = {
    HEIGHT: 8,
    WIDTH: 8,
    COUNT: 8 * 8,
    REFGRID: new Grid(8, 8),
    TILEPX: 50,
    SPACING: 1,
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
    const randomID = Util.d(GLOB.COUNT) - 1;
    const randomCell = "bg_" + Util.n2Cell(randomID);
    let randomdiv = document.getElementById(randomCell);
}
function TurnOnButtons(aComp) {
    document.getElementById("b0").addEventListener("click", stages.reset);
    document.getElementById("b1").addEventListener("click", aComp);
    document.getElementById("b2").addEventListener("click", SPELLS.CrazyTiles);
    document.getElementById("b3").addEventListener("click", WriteNumber);
    document.getElementById("b4").value = "StampNumber";
    document.getElementById("b4").addEventListener("click", stampNumber);
}
;
import { Scene, Util } from "./Classes.js";
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
import { Grid, Composition } from "./Classes.js";
function CompositionTesting() {
    let comp = new Composition({ comptainer: "layer_bg", TILEPX: GLOB.TILEPX, SPACING: GLOB.SPACING, nWide: GLOB.WIDTH, nTall: GLOB.HEIGHT });
    comp.init();
    comp.fill(5);
    comp.refresh();
    TurnOnButtons(comp);
}
CompositionTesting();
function n2CellTesting(aComp) {
    let MAX = aComp.nWide * aComp.nTall;
    for (let i = 0; i < MAX; i++) {
        const randomCell = "bg_" + Util.n2Cell(i, aComp.bg);
        console.log("testing", i, randomCell);
    }
}
