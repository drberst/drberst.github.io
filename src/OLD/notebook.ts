
import Matrix from "./matrix.js";
import PosBuilder from "./builders2.js";
import Utils from "./utils.js";

let controller = {
    updateList: [],
    size() {
        return this.updateList.length
    },
    update() {
        console.log(controller.size(), "updates", controller.updateList);
        for (let index = 0; index < controller.size(); index++) {
            const element = controller.updateList[index];
            element.updateHtml();
        }
        controller.updateList = [];
    },
    queue_update(aTile) {
        controller.updateList.push(aTile);
        if (controller.size() > 0) {
            window.requestAnimationFrame(controller.update)
        };
    }
};
// #MAIN --------------------------------------
let main = function () {
    document.documentElement.style.setProperty('--tileSize', '50px');
    document.documentElement.style.setProperty('--totalWidth', Notebook.width * 50 + 'px');
    let randomLayer = {
        ...Layer,
        name: "randomLayer"
    };
    randomLayer.set("N10", {
        ...Tile,
        content: "someTileN10"
    });
    randomLayer.set("A1", {
        ...Tile,
        content: "someTileA1"
    });

    // let freezeLayer = {
    //     ...layer, // key=123 val=
    //     name:"freeze",
    //     type: typeof(layer),
    //     apply: function() {
    //         let map = this.map;
    //         map.forEach(aLayer,key) {
    //             aLayer.framelen
    //         }
    //     }
    // }
    // test.layers.push(randomLayer);
    Notebook.addPage();
    console.log("RESULT:", Notebook.count());
    console.log("Framelen:", Notebook.framelen(), "ms");

    document.getElementById("clickMe").onclick = function () {
        let n = 1;
        for (let i = 0; i < n; i++) {
            // const element = array[i];
            let aTile = Notebook.lastPage().random_tile();
            console.log("BUTTON ACTIVATION", "target=", aTile);
            // let aMatrix = new Matrix(3, 3, aTile.id);
            // aTile.value = aMatrix;
            aTile.value = Math.floor(Math.random() * 100);
            controller.queue_update(aTile);
        }
    }

    // document.getElementById("clickMe").click();
}

let Notebook = {
    width: 16,
    height: 25,
    count() {
        return this.width * this.height
    },
    framelen(n = 1000) {
        return n / this.count()
    },
    css: {
        classes: {
            tile: "tile",
            page: "page"
        },
        pixels: 25
    },
    pages: [],
    current_page: -1,
    addPage() {
        this.current_page++;
        let aPage = {
            ...Page
        };
        let index = 0;
        aPage.div.classList.add(this.css.classes.page);

        for (let rows = 0; rows < this.height; rows++) {
            for (let cols = 0; cols < this.width; cols++) {
                let cellname = Utils.xy2Cell(cols, rows);
                let aTile = {
                    ...Tile
                };
                let div = document.createElement('div');


                aTile.parent_page = aPage;
                aTile.div = div;
                aTile.number = index
                aTile.value = cellname;

                div.id = aTile.number.toString();
                div.innerHTML = aTile.value;
                div.title = aTile.number.toString();
                div.className = this.css.classes.tile;



                // extra tiles

                setTimeout(function () {
                    aPage.div.append(div)
                }, this.framelen() * index)

                // if(cols==(this.width-1)) aPage.div.append(document.createElement("br"));

                // div.addEventListener('click', event => {
                //     makeplayer(event.currentTarget);
                // });
                aPage.tiles.push(aTile);
                // this.tiles.set(cellname,new tile(cellname,div,"D"));
                index++;
            }
        }

        // aPage.layers.forEach(L => {
        //     L.applyLayer(this.tiles);
        // });

        this.pages.push(aPage);
    },
    lastPage(): typeof Page {
        return this.pages[this.current_page];
    },
    // random_tile() {
    //     return this.lastPage().random_tile();
    // },
    subdivide() {
        let n = 4;
        let aPage = this.lastPage();

        let tiles = aPage.tiles;
        tiles.forEach(aTile => {
            let tempTile = {
                ...aTile
            };
            tempTile.parent = aTile;
            aTile.value = 5;
        });
    },

    updateHtml() {
        let index = 0;
        this.lastPage().tiles.forEach(tile => {
            tile.updateHtml();
        });
    }
}

let Page = {
    number: 1,
    parent_notebook: Notebook,
    layers: [],
    tiles: [],
    id: "PAGE1",
    div: document.querySelector("#PAGE1"),
    random_tile() {
        let result = Math.floor(Math.random() * this.tiles.length);
        return this.tiles[result];
    }
    // create() {
    //     // console.log("I am test"+count);
    //     for (let i = 0; i < count; i++) {
    //         let content = `${this.tileId}`;
    //         let div = document.createElement('div');
    //         div.id = tilemaker.tileId;
    //         div.className = tilemaker.tileClass;
    //         div.innerHTML = content;
    //         div.title = content;
    //         tilemaker.tileId++;
    //         tileCount++;
    //         let spot = document.getElementById("tilecontainer");
    //         spot.appendChild(div);
    //         div.addEventListener('click', event => {
    //             makeplayer(event.currentTarget);
    //         });

    //     }
    // }
}

let Tile = {
    number: 0,
    parent_page: {},
    div: {},
    value: "{contentObject}",
    extra_css: "tile",
    updateHtml(duration) {
        let element = this.div;
        element.innerHTML = this.value;
        element.id = this.number;
        // element.innerHTML = this.value;
        element.title = this.number;
        element.className = this.extra_css;
        if (element.innerHTML.length > 4) {
            element.className = "tile tileTiny";
        }
        this.shine(duration);
        // div.className = this.css.classes.tile;
    },
    shine(duration) {
        let element = this.div;
        Utils.clean(element);
        let delay = (duration === null) ? this.parent_page.parent_notebook.framelen() * this.number : duration;
        // delay += 'ms';
        // element.style.animationDelay = delay;
        setTimeout(function () {
            element.classList.add("tileHighlight");
            element.addEventListener('animationend', () => {
                Utils.clean(element)
            });
        }, delay)

    }
}

let Layer = {
    name: "floor",
    map: new Map(),
    type: typeof ("string"),
    rows: 25,
    cols: 16,
    get(key) {
        return this.map.get(key);
    },
    set(key, val) {
        this.map.set(key, val);
    },
    apply: undefined
}



// var book = new notebook(25,25);

// let playertile;
// let tileContainerWidth = 26;
// let tileCount = 0;

// var tilemaker = {
//     tileClass: "tile",
//     tileId: 0,
//     // template: `<div class=${tileClass} id=${tileId}><div class="tilecontent" id=${tileId}>id=[${tileId}]</div></div>` ,
//     print: function(count =5) {
//         console.log("I am test"+count);
//         for (let i = 0; i < count; i++) {
//             let content = `${this.tileId}`;
//             let div = document.createElement('div');
//             div.id = tilemaker.tileId;
//             div.className = tilemaker.tileClass;
//             div.innerHTML = content;
//             div.title = content;
//             tilemaker.tileId++;
//             tileCount++;
//             let spot = document.getElementById("tilecontainer");
//             spot.appendChild(div);
//             div.addEventListener('click', event => {
//                 makeplayer(event.currentTarget);
//             });

//         }
//     }
// };

// let makeplayer = function(aTile) {
//     // console.log("The player is gonna be...",aTile);

//     if(playertile!==undefined) playertile.classList.remove("player");
//     if(typeof(aTile) === 'number') aTile = document.getElementById(aTile);
//     playertile = aTile;
//     aTile.classList.add("player")
// }
// let highlightRandom = function(durationMilliseconds) {
//     let frameLength = durationMilliseconds/tileCount;
//     for (let i = 0; i < tileCount; i++) {
//         const element = document.getElementById(i);
//         // -> removing the class
//                 //
//         element.classList.remove("tileHighlight");

//         // -> triggering reflow /* The actual magic */
//         // without this it wouldn't work. Try uncommenting the line and the transition won't be retriggered.
//         // Oops! This won't work in strict mode. Thanks Felis Phasma!
//         // element.offsetWidth = element.offsetWidth;
//         // Do this instead:
//                 void element.offsetWidth;

//         // -> and re-adding the class
//         element.classList.add("tileHighlight");
//         element.style.animationDelay=`${frameLength*i}ms`;
//         element.addEventListener('animationend', animationEndCallback = () => {
//             // element.style["visibility"]= "hidden";

//             // element.removeEventListener('animationend', animationEndCallback);

//             // animationEventLog.textContent = `${animationEventLog.textContent}'animation ended'`;
//             if(i===(tileCount-1))
//             makeplayer(document.getElementById(winner));
//             // element.classList.remove('tileHighlight');
//             // applyAnimation.textContent = "Activate animation";
//             // setTimeout(function(){ element.classList.remove("tileHighlight"); }, frameLength*3);
//         });
//     }
//     let winner = parseInt(Math.random() * tileCount);
// }
// document.getElementById("clickMe").onclick = function() {
//     tilemaker.print(5);
//     highlightRandom(1000);

// }
// if (chosenId > tilecount || chosenId < 0) return aTile;


// let get = function(strDirection,aTile) {
//     // if (Number(aTile.id)+tileContainerWidth > tilecount || Number(aTile.id)-tileContainerWidth < 0) return aTile;
//     switch (strDirection) {
//         case "N":
//             return (Number(aTile.id)-tileContainerWidth < 0 ) ? aTile : getNorth(aTile);
//             break;
//         case "W":
//             return (Number(aTile.id)-1 < 0 ) ? aTile : getWest(aTile);
//             break;
//         case "E":
//             return (Number(aTile.id)+1 >= tileCount) ? aTile : getEast(aTile);
//             break;
//         case "S":
//             return (Number(aTile.id)+tileContainerWidth > tileCount ) ? aTile : getSouth(aTile);
//             break;
//     }
// }
// let getWest = function(aTile) {
//     let chosenId = Number(aTile.id) -1;
//     return document.getElementById(chosenId);
// }
// let getEast = function(aTile) {
//     let chosenId = Number(aTile.id) +1;
//     return document.getElementById(chosenId);
// }
// let getNorth = function(aTile) {
//     let chosenId = Number(aTile.id) -tileContainerWidth;
//     return document.getElementById(chosenId);
// }
// let getSouth = function(aTile) {
//     let chosenId = Number(aTile.id) +tileContainerWidth;
//     return document.getElementById(chosenId);
// }
// document.addEventListener("keydown", function(event) {
//     console.log(event.code);
//     // let target =
//     switch(event.code) {
//         case "KeyS":
//         case "ArrowDown":
//             // Handle "back"
//             makeplayer(get("S",playertile));
//             break;
//         case "KeyW":
//         case "ArrowUp":
//             // Handle "forward"
//             makeplayer(get("N",playertile));
//             break;
//         case "KeyA":
//         case "ArrowLeft":
//             // Handle "turn left"
//             // console.log(get("L",playertile));
//             makeplayer(get("W",playertile));
//             break;
//         case "KeyD":
//         case "ArrowRight":
//             // Handle "turn right"
//             makeplayer(get("E",playertile));
//             break;
//     }
// });


// tilemaker.print(10*26);
// document.getElementById("clickMe").click();
// document.getElementById("350").classList.add("player");
main();