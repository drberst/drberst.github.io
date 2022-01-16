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
function TurnOnButtons() {
}
import { Grid, SingleLayerComp } from "./Classes.js";
import Audio from "./Audio.js";
function musicalTesting() {
    let comp = new SingleLayerComp({ comptainer: "layer_bg", nWide: 12, nTall: 8 });
    comp.init(0);
    Audio.mp3Visualizer(comp);
}
;
function micTesting() {
    let comp = new SingleLayerComp({ comptainer: "layer_bg", nWide: 12, nTall: 8 });
    comp.init(0);
    Audio.micVisualizer(comp);
}
export default { musicalTesting, micTesting };
//# sourceMappingURL=main.js.map