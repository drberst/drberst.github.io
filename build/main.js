let h = 8;
let w = 12;
const GLOB = {
    HEIGHT: h,
    WIDTH: w,
    COUNT: h * w,
    REFGRID: new Grid(w, h),
    TILEPX: 40,
    SPACING: 0,
    container_div: "#layer_bg",
    LOWER: "abcdefghijklmnopqrstuvqxyz",
    UPPER: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
};
const MAPS = {
    id2cell: new Map(),
    cell2val: new Map()
};
class Nav {
    static directions(id) {
        return {
            above: id - GLOB.WIDTH,
            below: id + GLOB.WIDTH,
            left: id - 1,
            right: id + 1
        };
    }
}
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
import Audio from "./Audio.js";
function musicalTesting() {
    let comp = new Composition({ comptainer: "layer_bg", TILEPX: GLOB.TILEPX, SPACING: GLOB.SPACING, nWide: GLOB.WIDTH, nTall: GLOB.HEIGHT });
    comp.init();
    comp.fill(-1);
    comp.refresh();
    Audio.mp3Visualizer(comp);
}
;
export default { TurnOnButtons };
//# sourceMappingURL=main.js.map