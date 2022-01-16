import Audio from "./Audio.js";
import SingleLayerComp from "./SingleLayerComp.js";
function musicalTesting() {
    let comp = new SingleLayerComp({ comptainer: "layer_bg", nWide: 12, nTall: 12 });
    comp.init();
    console.log("hello", "rows", comp.nTall, "cols", comp.nWide);
    Audio.mp3Visualizer(comp);
}
;
const G = {
    len: 5
};
function Main() {
    let comp = new SingleLayerComp({ comptainer: "layer_bg", nWide: 50, nTall: 50 });
    comp.init(-1);
    comp.refresh();
    initialPop(comp);
    gameloop(comp, 0);
}
function gameloop(comp, i) {
    let keys = comp.grid.map;
    let old = new Map(keys);
    for (let [k, v] of old) {
        let spot = comp.grid.locate(k);
        let neighbors = spot.get8Neighbors();
        let LiveNeighbors = 0;
        for (let n of neighbors) {
            if (old.get(n) >= 0)
                LiveNeighbors++;
        }
        if (v >= 0) {
            if (LiveNeighbors < 2)
                comp.set(k, 0);
            if (LiveNeighbors > 3)
                comp.set(k, 0);
            if (LiveNeighbors === 2 || LiveNeighbors === 3)
                comp.set(k, v + 1);
        }
        else {
            if (LiveNeighbors === 3)
                comp.set(k, 1);
        }
        if (v > 100) {
            comp.fill(-1);
            initialPop(comp);
            break;
        }
    }
    ;
    comp.refresh();
    setTimeout(() => gameloop(comp, i + 1), 10);
}
function getNeighbors(location) {
}
function initialPop(comp) {
    let keys = comp.grid.map;
    let i = 0;
    for (let [k, v] of keys) {
        const r2 = Math.random();
        if (r2 >= .9 && i <= 100) {
            comp.grid.set(k, 0);
            i++;
        }
    }
    ;
    comp.refresh();
}
export { Main };
//# sourceMappingURL=new main lol.js.map