/*
1. Glob2al vars
2. collections of data
3. collections of functions
4. Using pieces 1-3 for stage 2 complexity
5. Assembling into final complexity
*/


import Audio from "./Audio.js";
import { Loc } from "./Grid.js";
import SingleLayerComp from "./SingleLayerComp.js"
import Util from "./Util.js";
function musicalTesting() {
    let comp = new SingleLayerComp({ comptainer: "layer_bg", nWide: 12, nTall: 12 });
    // comp.fill(-1);
    comp.init();
    // comp.set_bg("B1", 5);
    // debugger;
    // comp.fillWithFunc(function () {
    //     return Util.d(10) == 1;
    // })
    // comp.refresh();
    // TurnOnButtons();
    console.log("hello", "rows", comp.nTall, "cols", comp.nWide);
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
const G = {
    len: 5
}
function Main() {
    let comp = new SingleLayerComp({ comptainer: "layer_bg", nWide: 50, nTall: 50 });
    // comp.fill(-1);
    comp.init(-1);
    // for (let i = 0; i < 26 * 26 + 29; i++) {
    //     console.log(i, Util.num2Abc(i))

    // }

    // comp.set("J15", 0)
    // comp.set("K15", 0)
    // comp.set("L15", 0)
    comp.refresh();
    initialPop(comp);
    // let keys = comp.grid.map;
    // let i = 0;
    // for (let [k, v] of keys) {
    //     const r = Math.floor(Math.random() * 5) + 1;
    //     comp.grid.set(k, r);
    // };
    gameloop(comp, 0);
    // setInterval((comp) => gameloop(comp), 200);
}
function gameloop(comp, i) {
    // console.time();
    let keys = comp.grid.map;
    let old = new Map<string, number>(keys);

    // let newGrid = new Grid(comp.)
    for (let [k, v] of old) {
        // if (v >= 0) {
        let spot = comp.grid.locate(k);
        let neighbors = spot.get8Neighbors();
        // Util.out("old:" + spot)
        // Util.out("neighbors:" + spot.get8Neighbors())
        // console.log(spot.getCellname(), spot.get8Neighbors());
        let LiveNeighbors = 0;
        for (let n of neighbors) {
            if (old.get(n) >= 0) LiveNeighbors++;
        }
        if (v >= 0) {
            // if (LiveNeighbors > 0) console.log(k, LiveNeighbors)
            if (LiveNeighbors < 2) comp.set(k, 0);
            if (LiveNeighbors > 3) comp.set(k, 0);
            if (LiveNeighbors === 2 || LiveNeighbors === 3) comp.set(k, v + 1);
        } else {
            if (LiveNeighbors === 3) comp.set(k, 1);
            // else comp.set(k, -1)
        }
        if (v > 100) {
            comp.fill(-1);
            initialPop(comp);
            break;
            // comp.set(k, -1)
        }
        // console.log(LiveNeighbors)
        // neighbors.for
        // spot.shiftY(1);

        // Util.out("new:" + spot)
        // comp.set(k, v - 1);
        // comp.set(spot.getCellname(), v);
        // }
    };
    comp.refresh();
    // console.timeEnd();
    setTimeout(() => gameloop(comp, i + 1), 10);
    // requestAnimationFrame(() => gameloop(comp, i + 1));
}
function getNeighbors(location: Loc) {

}
function initialPop(comp) {
    let keys = comp.grid.map;
    let i = 0;
    for (let [k, v] of keys) {
        // const r = Math.floor(Math.random() * 1);
        const r2 = Math.random();
        if (r2 >= .9 && i <= 100) {
            comp.grid.set(k, 0);
            i++
        }
        // Util.out(comp.grid.locate(k))
    };
    comp.refresh();
}
export { Main }
// TurnOnButtons();
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// let test = visualizer();
// test.getAudio();
// musicalTesting();

/**
 * cellular algorithm
 * populate random cells with some value
 * run a function each frame that loops each cell and does something based on the current state
 */