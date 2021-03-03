/*
1. Global vars
2. collections of data
3. collections of functions
4. Using pieces 1-3 for stage 2 complexity
5. Assembling into final complexity
*/
6
let h = 32;
let w = 32;
const GLOB = { // Universal constants
    HEIGHT: h, //Height / Y
    WIDTH: w, //Width  / X
    COUNT: h * w,
    REFGRID: new Grid(w, h),
    TILEPX: 25,
    SPACING: 1,
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


function WriteNumber() {
    // let startcell = 0;
    // let results = Utils.ascii2CellList(new Loc(new Grid(3, 3,), 0, 0), ["_1"]);
    // results.forEach(element => {
    //     Utils.update_div_value(document.querySelector("#" + element), "1");
    // });
    console.log("writenumber")
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

    // GridArtist
    mainstage.print("layer_1");

}

function miniRando() {
    const randomID = Util.d(GLOB.COUNT) - 1;
    const randomCell = "bg_" + Util.n2Cell(randomID);
    let randomdiv = document.getElementById(randomCell);
    // Utils.update_div_value(randomdiv, String(Util.d(7)));
    // const oldval = aComp.get_bg(randomdiv.id);
    // aComp.set_bg(randomdiv.id, oldval + 1);
}


function TurnOnButtons(aComp: Composition) {
    document.getElementById("b0").addEventListener("click", stages.reset);
    document.getElementById("b1").addEventListener("click", aComp);
    document.getElementById("b2").addEventListener("click", SPELLS.CrazyTiles);
    document.getElementById("b3").addEventListener("click", WriteNumber);
    (document.getElementById("b4") as HTMLButtonElement).value = "StampNumber";
    document.getElementById("b4").addEventListener("click", stampNumber);

};
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

    // GridArtist
    mainstage.print("layer_2");

    // let mainstage2 = new SScene("layer_2");
    // let grod2 = Grid.fromAscii(pattern_2);
    // mainstage2.addDiv("grod2");
    // mainstage2.addGrid(grod2, "grod2");
    // mainstage2.print("layer_2");
    // console.log(grod2);
}

// Automata();
// export { Utils };
import { Grid, Loc, Composition } from "./Classes.js";
function CompositionTesting() {
    let comp = new Composition({ comptainer: "layer_bg", TILEPX: GLOB.TILEPX, SPACING: GLOB.SPACING, nWide: GLOB.WIDTH, nTall: GLOB.HEIGHT });
    comp.init();
    // comp.set_bg("B1", 5);
    // debugger;
    // comp.fill(9);
    // comp.refresh();
    TurnOnButtons(comp);
    comp.miniRando(100);
    comp.gameOfLife();
    // n2CellTesting(comp);
}
CompositionTesting();
// function chainReaction(aComp:Composition) {
//     let MAX = aComp.nWide * aComp.nTall;
//     for (let i = 0; i < MAX; i++) {
//         const current = "bg_" + Util.n2Cell(i, aComp.bg);
//         console.log("testing", i, randomCell);

//         aCompo
//     }
// }
function n2CellTesting(aComp: Composition) {
    let MAX = aComp.nWide * aComp.nTall;
    for (let i = 0; i < MAX; i++) {

        const randomCell = "bg_" + Util.n2Cell(i, aComp.bg);
        console.log("testing", i, randomCell);

    }
}
// BuildGrid();
// TurnOnButtons();
// let eng = new Being();
// eng.start();
// SPELLS.CrazyTiles(1000);
// WriteNumber();
