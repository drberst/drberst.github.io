import Utils from "./utils.js";
let controller = {
    updateList: [],
    size() {
        return this.updateList.length;
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
            window.requestAnimationFrame(controller.update);
        }
        ;
    }
};
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
    Notebook.addPage();
    console.log("RESULT:", Notebook.count());
    console.log("Framelen:", Notebook.framelen(), "ms");
    document.getElementById("clickMe").onclick = function () {
        let n = 1;
        for (let i = 0; i < n; i++) {
            let aTile = Notebook.lastPage().random_tile();
            console.log("BUTTON ACTIVATION", "target=", aTile);
            aTile.value = Math.floor(Math.random() * 100);
            controller.queue_update(aTile);
        }
    };
};
let Notebook = {
    width: 16,
    height: 25,
    count() {
        return this.width * this.height;
    },
    framelen(n = 1000) {
        return n / this.count();
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
                aTile.number = index;
                aTile.value = cellname;
                div.id = aTile.number.toString();
                div.innerHTML = aTile.value;
                div.title = aTile.number.toString();
                div.className = this.css.classes.tile;
                setTimeout(function () {
                    aPage.div.append(div);
                }, this.framelen() * index);
                aPage.tiles.push(aTile);
                index++;
            }
        }
        this.pages.push(aPage);
    },
    lastPage() {
        return this.pages[this.current_page];
    },
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
};
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
};
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
        element.title = this.number;
        element.className = this.extra_css;
        if (element.innerHTML.length > 4) {
            element.className = "tile tileTiny";
        }
        this.shine(duration);
    },
    shine(duration) {
        let element = this.div;
        Utils.clean(element);
        let delay = (duration === null) ? this.parent_page.parent_notebook.framelen() * this.number : duration;
        setTimeout(function () {
            element.classList.add("tileHighlight");
            element.addEventListener('animationend', () => {
                Utils.clean(element);
            });
        }, delay);
    }
};
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
};
main();
