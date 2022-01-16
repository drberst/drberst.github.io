/*
1. Global vars
2. collections of data
3. collections of functions
4. Using pieces 1-3 for stage 2 complexity
5. Assembling into final complexity
*/

let h = 8;
let w = 12;
const GLOB = { // Universal constants
    HEIGHT: h, //Height / Y
    WIDTH: w, //Width  / X
    COUNT: h * w,
    REFGRID: new Grid(w, h),
    TILEPX: 40,
    SPACING: 0,
    container_div: "#layer_bg",
    LOWER: "abcdefghijklmnopqrstuvqxyz",
    UPPER: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
}
const MAPS = { // Reality arisen from constants
    id2cell: new Map(),
    cell2val: new Map()
}

function TurnOnButtons() {
    // document.getElementById("b0").addEventListener("click", stages.reset);
    // document.getElementById("b1").addEventListener("click", aComp);
    // document.getElementById("b2").addEventListener("click", SPELLS.CrazyTiles);
    // document.getElementById("b3").addEventListener("click", WriteNumber);
    // (document.getElementById("b4") as HTMLButtonElement).value = "Play";
    // document.getElementById("b4").addEventListener("click", musicalTesting);
}
import { Grid, SingleLayerComp, Util } from "./Classes.js";

import Audio from "./Audio.js";
function musicalTesting() {
    let comp: SingleLayerComp = new SingleLayerComp({ comptainer: "layer_bg", nWide: 12, nTall: 8 });
    comp.init(0);
    // let x = 0;
    // setInterval(function () {
    //     // comp.init(0.1 * x++);
    //     let random = Util.d(10);
    //     let rcell = Math.random() * comp.size();
    //     let cellname = Util.n2Cell(rcell, comp.grid);
    //     comp.setProp(cellname, "title", "TEST");
    //     // aComp.setProp(cell, "title", scaleHz.toFixed(3));

    //     comp.setN(rcell, random);
    //     comp.refresh();
    // }, 1000)
    // comp.set_bg("B1", 5);
    // debugger;
    // comp.fill(-1);
    // comp.fillWithFunc(function () {
    //     return Util.d(10) == 1;
    // })
    // comp.refresh();
    // TurnOnButtons();
    // Audio.micVisualizer(comp);

    Audio.mp3Visualizer(comp);
    // Audio.visualizer(comp);
    // musicer.audio();
    // var audioCtx = new (window.AudioContext)();
    // var analyser = audioCtx.createAnalyser();
    // // source = audioCtx.createMediaStreamSource(stream);
    // // source.connect(analyser);
    // // analyser.connect(distortion);
    // // distortion.connect(audioCtx.destination);

    // analyser.fftSize = 2048;
    // var bufferLength = analyser.frequencyBinCount;
    // var dataArray = new Uint8Array(bufferLength);
};

function micTesting() {
    let comp: SingleLayerComp = new SingleLayerComp({ comptainer: "layer_bg", nWide: 12, nTall: 8 });
    comp.init(0);
    Audio.micVisualizer(comp);

}
export default { musicalTesting, micTesting }

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// let test = visualizer();
// test.getAudio();
// musicalTesting();