export { Loc, Grid, Composition, Util };

//! ------------------------------------------------------------------------------------------ PRIMARY

class Composition {
    TILEPX = 25;
    bg: Grid;
    // fg: Grid;
    nWide: number;
    nTall: number;
    comptainer_id;
    options;
    redrawList: Set<string>;
    constructor(options) {
        this.options = options;
        this.TILEPX = options.TILEPX ? options.TILEPX : 25;
        this.nWide = options.nWide ? options.nWide : 8;
        this.nTall = options.nTall ? options.nTall : 8;
        this.comptainer_id = options.comptainer ? options.comptainer : "compo" + this.nWide + this.nTall;
        this.bg = new Grid(this.nWide, this.nTall);
        this.bg.name = "bg";
        // this.fg = new Grid(this.nWide, this.nTall);
        // this.fg.name = "fg";
        this.redrawList = new Set();
    }
    handleEvent(event) {
        console.log(event);
        this.gameOfLife(100);
    }
    gameOfLife(n = 100) {
        let thiscomp = this;
        // let activeCells = [];

        // thiscomp.bg.map.forEach(function (val, key) {
        //     if (val > 0) {
        //         activeCells.push(key);
        //     }
        // });
        Util.setIntervalX(function () {
            // console.log(thiscomp, "game round:", count++, "before", thiscomp.bg.toString());
            thiscomp.gameOfLifeRound();
            // console.log("game round:", count, "after", thiscomp.bg.toString());
            // console.log("Game of life, cell", current, "active neighbors", activeNeighbors, "neighborhood", neighbors);
            // const randomID = Util.d(thiscomp.nWide * thiscomp.nTall) - 1;
            // const randomCell = "bg_" + Util.n2Cell(randomID, thiscomp.bg);
            // let randomdiv = document.getElementById(randomCell);
            // Utils.update_div_value(randomdiv, String(Util.d(7)));
            // const oldval = thiscomp.get_bg(randomdiv.id);
            // thiscomp.set_bg(randomdiv.id, oldval ? oldval + 1 : 1);
            // thiscomp.refresh();
        }, 0, n);
    }
    gameOfLifeRound() {

        let grid = this.bg;
        // let start = new Loc(grid, 0, 0)
        let map = new Map(grid.map);
        map.forEach((val, key) => {
            let current = Loc.new_fromCell(grid, key);
            let neighbors = current.get8Neighbors();
            let activeNeighbors = 0;
            for (let i = 0; i < neighbors.length; i++) {
                const element = neighbors[i];
                // let html = Util.$id(key);
                // html.style.fontWeight = "bold";
                let val = grid.atLoc(element);
                if (val == 1) activeNeighbors++;
                // debugger;
            }
            let newval = 0;
            if (val > 0) {
                if (activeNeighbors == 2 || activeNeighbors == 3) {
                    newval = 1;
                }
            } else if (activeNeighbors == 3) {
                newval = 1;
            }
            grid.set(key, newval);
            // else grid.set(key, 0);
            if (map.get(key) != grid.map.get(key))
                this.queue_redraw(key);
        });
        this.refresh();
    }
    miniRando(n = 100) {
        let comporef = this;
        Util.setIntervalX(function () {
            for (let index = 0; index < n / 10; index++) {
                const randomID = Util.d(comporef.nWide * comporef.nTall) - 1;
                const randomCell = Util.n2Cell(randomID, comporef.bg);
                let randomdiv = document.getElementById(randomCell);
                const oldval = comporef.get_bg(randomdiv.id);
                comporef.set_bg(randomdiv.id, oldval ? oldval + 1 : 1);
            }
            comporef.refresh()

        }, 0, n / 10);
        // Util.setIntervalX(function () {
        // }, 1000, n);
    }
    append(html) {
        const element = Util.$id(this.comptainer_id);
        element.appendChild(html);
    }
    increment(key) {
        this.set_bg(key, this.get_bg(key) + 1);
    }
    decrement(key) {
        this.set_bg(key, this.get_bg(key) - 1);
    }

    fillWithFunc(aFunc) {
        const grid = this.bg;
        for (let i = 0; i < grid.cols * grid.rows; i++) {
            const cell = Util.n2Cell(i, grid);
            let value = aFunc();
            grid.set(cell, value);
            this.redrawList.add(cell);
        }
    }
    fill(value = 0) {
        const grid = this.bg;
        for (let i = 0; i < grid.cols * grid.rows; i++) {
            const cell = Util.n2Cell(i, grid);
            grid.set(cell, value);
            this.redrawList.add(cell);
        }
        // this.bg.map.forEach((val, key) => {
        //     this.redrawList.add(key);
        // });
    }
    // static fixkey(aKey) {
    //     let parts = aKey.split("_");
    //     if(parts.length > 0)
    // }

    get_bg(key: string) {
        return this.bg.get(key);
    }
    set_bg(key, val) {
        if (Util.cell2Xy(key, this.bg))
            this.bg.set(key, val);
        this.redrawList.add(key);
    }
    queue_redraw(key) {
        this.redrawList.add(key);
    }
    refresh2() {
        // console.log("Drawing:", this.redrawList.size, "elements");
        // console.timeStamp;

        GridArtist.makeArt(Util.$id(this.comptainer_id), this.bg, { ...this.options, TILEPX: this.TILEPX, name: "bg" })
        // let node = Util.$id(this.comptainer_id); debugger;
        // node.innerHTML = gridHTML.innerHTML;
        // Util.$id(this.comptainer_id).replaceWith(gridHTML);

        this.redrawList = new Set();
        // console.log(console.timeEnd());

    }

    refresh() {
        // console.time();
        // console.log("Drawing:", this.redrawList.size, "elements");

        this.redrawList.forEach(id => {
            // const bgid = "bg_"+id
            let element = Util.$id(id);
            if (element) {
                // debugger;
                let result = GridArtist.htmlForCell(this.bg, id);
                element.replaceWith(result);
            }
            else {
                console.error("null value in refresh", id);
                debugger;
            }

            // element.outerHTML = result.outerHTML;
            // element.textContent = result.textContent;
            // element.className = result.className;
            // element = result;
            // element.innerText = String(val);
        });
        // let gridHTML = GridArtist.drawOnFreshCanvas(this.bg, { TILEPX: 24, name: this.comptainer + "-grid" })
        // this.update(gridHTML);
        // console.timeEnd();
        this.redrawList = new Set();
    }
    init() {
        document.documentElement.style.setProperty('--tileSize', this.TILEPX + 'px');
        document.documentElement.style.setProperty('--totalWidth', this.nWide * (this.TILEPX + this.options.SPACING) + 'px');
        // document.documentElement.style.setProperty('--compTop', this.nWide * (this.TILEPX + this.options.SPACING) + 'px');
        // let gridHTML = GridArtist.drawOnFreshCanvas(this.bg, { ...this.options, TILEPX: this.TILEPX, name: "bg" })
        // this.append(gridHTML);
        GridArtist.makeArt(this.comptainer_id, this.bg, { ...this.options, TILEPX: this.TILEPX, name: "bg" })
        // let html_fg = document.createElement("div");
    }
    size() {
        return this.nWide * this.nTall;
    }
}



class GridArtist {
    // static drawOnFreshCanvas(aGrid, options) {
    //     let wrapper = document.createElement("div");
    //     wrapper.id = "freshcanvas_" + options.name;
    //     GridArtist.makeArt(wrapper, aGrid, options);
    //     return wrapper;
    // }

    static htmlForCell(aGrid, cellname) {
        let cell = document.createElement("div");
        let val = aGrid.get(cellname);
        if (val === undefined) val = -1;
        cell.id = cellname;
        cell.title = String(Loc.new_fromCell(aGrid, cellname).getIndex());
        // cell.className = "tile level" + val;
        cell.className = "tile";
        if (val >= 0) {
            const h = 0 + (val / 100) * 60;
            const s = 70;
            const l = (val < 25) ? 30 + val / 8 : 10 + val * .9;
            // cell.style.color = "red";
            // cell.style.backgroundColor = "hsl(" + val * 3.6 + ", 60%, " + (30 + val / 3) + "%)";

            cell.style.backgroundColor = `hsl(${h}, ${s}%, ${l}%)`;
        } else if (val == 0) {

        }
        // debugger;
        // Inner cell
        let inner_cell = document.createElement("div");
        inner_cell.id = cellname + "_val";
        // inner_cell.value = val;
        inner_cell.innerText = val;
        if (val === -1) {
            inner_cell.innerText = cellname;
        }
        inner_cell.className = "tileInner";
        // cell.innerHTML = `<div class=tile2line>${val}</div>`;
        cell.appendChild(inner_cell);
        return cell;
    }

    static makeArt(wrapper: HTMLElement, aGrid: Grid, options): HTMLElement {
        let index = 0;
        if (typeof wrapper === 'string') {
            wrapper = Util.$id(wrapper);
        }
        const marg = options.SPACING;
        wrapper.innerHTML = "";
        wrapper.style.width = `${(options.TILEPX + marg) * aGrid.cols}px`;
        wrapper.style.height = `${(options.TILEPX + marg) * aGrid.rows}px`;


        for (let rows = 0; rows < aGrid.rows; rows++) {
            let row_wrapper = document.createElement("div");
            row_wrapper.id = options.name + "_row_" + rows;
            // row_wrapper.style.width = "100%";//options.TILEPX * aGrid.cols + "px"; //+wrapper.style.width;
            row_wrapper.style.height = options.TILEPX + "px";
            // row_wrapper.style.display = "inline";
            // debugger;
            wrapper.appendChild(row_wrapper);
            for (let cols = 0; cols < aGrid.cols; cols++) {
                let cellname = Util.xy2Cell(cols, rows);
                let cell = GridArtist.htmlForCell(aGrid, cellname);
                row_wrapper.append(cell);

                index++;
            }
        }
        // console.log(this);
        return wrapper;
    }
};


class Grid {
    static idcount = 0;
    rows;
    cols;
    map: Map<string, number>;
    size;
    name;

    constructor(x = 8, y = 8) {
        this.map = new Map();
        this.cols = x;
        this.rows = y;
        this.size = x * y;
        this.name = "G" + Grid.idcount++;
        // this.init();
    }
    static fromAscii(iAscii: Array<String>) {
        let result = new Grid(iAscii.length, iAscii[0].length);
        result.fromAscii(iAscii);
        return result;
    }
    init(val = 0) {
        for (let i = 0; i < this.cols * this.rows; i++) {
            this.map.set(Util.n2Cell(i, this), val);
        }
    }
    // prefixKey(aKey) { return this.name + "_" + aKey };
    get(key) {
        if (key.includes("_")) {
            console.log("got one at GET! key=", key);
            debugger;
            return this.map.get(key.split("_")[1]);
        }
        else return this.map.get(key);
    }
    set(key, val) {
        if (key.includes("_")) {
            console.log("got one at SET! key=", key);
            this.map.set(key.split("_")[1], val);
        }
        else this.map.set(key, val);
    }
    atLoc(Location: Loc) {
        return this.get(Location.getCellname());
    }
    toString(): string {
        let vals = Array.from(this.map.values());
        let result = "{\n";
        for (let i = 0; i < vals.length; i++) {
            const element = vals[i];
            if (i % this.cols === 0) result += "\n> ";
            result += element;
        }
        return result + "\n}";
    }
    toHTML() {
        let art = GridArtist.makeArt(this.name, this, { TILEPX: 24, name: "G" + this.name });

    }
    useStamp(aStamp: Grid) {
        // console.log("Applying Stamp=", aStamp.toString())
        // console.log("Before:", "Grid=", this.toString());
        // console.log("After:", "Grid=", this.toString());
        let target_cells = aStamp.map.keys();

        for (const element of target_cells) {
            if (element === " " || element === ".") continue;
            this.map.set(element, aStamp.get(element));
        }
    }
    fromAscii(iAscii, origin = new Loc(this, 0, 0)) {
        let start = origin;

        let vOffset = start.x;
        let hOffset = start.y;

        let ascii = iAscii;
        let currentcell = start;
        let result = [];
        for (let i = 0; i < ascii.length; i++) {
            const line = ascii[i];
            for (let nChar = 0; nChar < line.length; nChar++) {
                const element = line[nChar];
                const cellname = Util.xy2Cell(nChar + hOffset, i + vOffset);
                // this.map.set(cellname, 0);
                if (element !== ".") {
                    result.push(cellname);
                    this.map.set(cellname, element);
                }
                currentcell.shiftIndex(1);
            }
            currentcell.shiftIndex(this.cols);
        }
        console.log("Ascii done...", result)
        return result;
    }
}

//! ------------------------------------------------------------------------------------------ SECONDARY
class Loc {
    public x: number;
    public max_x: number;
    public y: number;
    public max_y: number;
    // public reference_grid: Grid;

    constructor(grid = new Grid(5, 5), x = 0, y = 0) {
        this.x = x;
        if (this.x > grid.cols) this.x -= grid.cols;
        if (this.x < 0) this.x += grid.cols;
        this.y = y;
        if (this.y > grid.rows) this.y -= grid.rows;
        if (this.y < 0) this.y += grid.rows;
        this.max_x = grid.cols;
        this.max_y = grid.rows;
        // this.reference_grid = grid;
    }

    static new_fromCell(grid = new Grid(5, 5), cellname) {
        let regresult = cellname.match(/([A-Z]+)(\d+)/);
        // if (cellname.length > 3) debugger;
        let x = Util.abc2Num(regresult[1])
        let y = Number(regresult[2]);

        return new Loc(grid, x, y);
    }
    static new_fromIndex(grid = new Grid(5, 5), n) {
        let xy = Util.n2Xy(n, grid);
        return new Loc(grid, xy.X, xy.Y)
        // return Loc.new_fromCell(grid, Util.n2Cell(n, grid));
    }
    getCellname() {
        return Util.xy2Cell(this.x, this.y);
    }
    getIndex() {
        return this.x + this.y * this.max_x;
    }
    shiftIndex(n = 1) {
        let newIndex = this.getIndex() + n;
        if (newIndex < 0 || newIndex >= this.max_x * this.max_y) return;
        // return this;
        return Loc.new_fromIndex(new Grid(this.max_x, this.max_y), newIndex);
    }
    shiftY(n = 1) { return new Loc(new Grid(this.max_x, this.max_y), this.x, this.y + n) };
    shiftX(n = 1) { return new Loc(new Grid(this.max_x, this.max_y), this.x + n, this.y) };
    get8Neighbors() {
        return [this.shiftY(-1).shiftX(-1), this.shiftY(-1), this.shiftY(-1).shiftX(1),
        this.shiftX(-1), this.shiftX(1),
        this.shiftY(1).shiftX(-1), this.shiftY(1), this.shiftY(1).shiftX(1),
        ]
    }
}


// - - - - - - - - - - - - - - - - - - - - - - - -

class Util {
    static incrementMap(map: Map<string, number>, key: string) {
        map.set(key, map.get(key) + 1);
    }
    static decrementMap(map: Map<string, number>, key: string) {
        map.set(key, map.get(key) - 1);
    }
    static MAPS;
    static GLOB = {
        HEIGHT: 30, //Height / Y
        WIDTH: 20, //Width  / X
        COUNT: 30 * 20,
        REFGRID: new Grid(8, 8),
        TILEPX: 24,
        container_div: "#layer_bg",
        LOWER: "abcdefghijklmnopqrstuvqxyz",
        UPPER: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    }

    static d(n) {
        return Math.floor(n * Math.random()) + 1;
    }
    static mapToObj(map) {
        const obj = {}
        for (let [k, v] of map)
            obj[k] = v
        return obj
    }
    static $(arg) {
        return document.querySelector(arg);
    }
    static $id(arg) {
        return document.getElementById(arg);
    }
    static num2Abc = function (num) {
        // const alphabet = "abcdefghijklmnopqrstuvqxyz";
        const len = Util.GLOB.UPPER.length;

        if (num < len && num >= 0) return Util.GLOB.UPPER.charAt(num);
        if (num - 26 >= 0) return Util.GLOB.UPPER.charAt(num - 26) + Util.num2Abc(num - 26);
        console.log("num2abcfail", num)
        return "null";
    }
    static abc2Num = function (abc) {
        // const Utils.GLOB.UPPER = "abcdefghijklmnopqrstuvqxyz";
        abc = abc.toUpperCase();
        if (abc.length === 1) return Util.GLOB.UPPER.indexOf(abc);
        if (abc.length === 2) return Util.GLOB.UPPER.length + Util.abc2Num(abc.substring(1));
        // if (abc.length === 2) return GLOB.UPPER.indexOf(abc.charAt(0)) + GLOB.UPPER.indexOf(abc.charAt(1))

        console.log("error in abc2Num");
        return -1;
    }
    static xy2Cell = function (x, y) {
        return Util.num2Abc(x).toUpperCase() + y;
    }

    static n2Xy = function (n, aGrid = Util.GLOB.REFGRID) {
        return { X: Math.floor(n % aGrid.cols), Y: Math.floor(n / aGrid.cols) }
    }
    static n2Cell = function (n, aGrid = Util.GLOB.REFGRID) {
        let temp = Util.n2Xy(n, aGrid);
        return Util.xy2Cell(temp.X, temp.Y);
    }

    static cell2Xy = function (cellname, aGrid = Util.GLOB.REFGRID) {
        let regresult = cellname.match(/([A-Z]+)(\d+)/);
        // if (cellname.length > 3) debugger;
        let x = Util.abc2Num(regresult[1])
        let y = Number(regresult[2]);
        return [x, y]
    }
    static cell2n = function (cellname, aGrid = Util.GLOB.REFGRID) {
        // if (cellname.length > 3) debugger;
        let [x, y] = Util.cell2Xy(cellname, aGrid);
        return x + y * aGrid.cols;

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
        return !Util.isNull(element);
    }

    static ascii2CellList(iStart = new Loc(new Grid(3, 3), 0, 0), iAscii = ["_1"]) {
        let start = iStart;

        let vOffset = start.x;
        let hOffset = start.y;

        let pattern_1 = [
            "110",
            "010",
            "010",
            "010",
            "111"
        ]
        let ascii = iAscii;
        if (ascii[0] === "_1") ascii = pattern_1;

        let currentcell = start;
        let result = [];
        for (let i = 0; i < ascii.length; i++) {
            const line = ascii[i];

            for (let nChar = 0; nChar < line.length; nChar++) {
                const element = line[nChar];
                // console.log(element);

                if (element === "1") {
                    result.push(Util.xy2Cell(nChar + hOffset, i + vOffset));
                }
                currentcell.shiftIndex(1);
            }
            currentcell.shiftIndex(Util.GLOB.WIDTH);
        }
        console.log("Done...", result)
        return result;
    }
    static setIntervalX(callback, delay, repetitions) {
        var x = 0;
        var intervalID = window.setInterval(function () {

            callback();

            if (++x === repetitions) {
                window.clearInterval(intervalID);
            }
        }, delay);
    }
    static cyclemanager(func, hz, count) {

        let cycle = 0;
        let stopperid = setInterval(function () {
            if (cycle >= count) {
                clearInterval(intervalid);
                clearInterval(stopperid);
            }
            cycle++;
        }, hz);
        let intervalid = setInterval(func, hz);
    }
    static timesomething(func) {
        const t0 = performance.now();
        func();
        const t1 = performance.now();
        console.log(`Call to ${func} took ${t1 - t0} milliseconds.`);
    }
}