export { Loc, Grid, Scene, Link, Composition, Util };

//! ------------------------------------------------------------------------------------------ PRIMARY

class Composition {
    TILEPX = 25;
    bg: Grid;
    fg: Grid;
    nWide;
    nTall;
    comptainer;
    options;
    redrawList: Array<string>;
    constructor(options) {
        this.options = options;
        this.TILEPX = options.TILEPX ? options.TILEPX : 25;
        this.nWide = options.nWide ? options.nWide : 8;
        this.nTall = options.nTall ? options.nTall : 8;
        this.comptainer = options.comptainer ? options.comptainer : "compo" + this.nWide + this.nTall;
        this.bg = new Grid(this.nWide, this.nTall);
        this.bg.name = "bg";
        this.fg = new Grid(this.nWide, this.nTall);
        this.fg.name = "fg";
        this.redrawList = [];
    }

    append(html) {
        const element = Util.$id(this.comptainer);
        element.appendChild(html);
    }
    update(html) {
        const element = Util.$id(this.comptainer);

        // element.removeChild() = html;
    }
    get_bg(key) {
        return this.bg.map.get("bg_" + key);
    }
    set_bg(key, val) {
        this.bg.map.set("bg_" + key, val);
        this.redrawList.push("bg_" + key);
    }
    refresh() {
        this.redrawList.forEach(id => {
            // const bgid = "bg_"+id
            let element = Util.$id(id);
            const val = this.bg.map.get(id);
            // debugger;
            let result = GridArtist.htmlForCell(this.bg, id);
            element.innerHTML = result.innerHTML;
            // element = result;
            // element.innerText = String(val);
        });
        // let gridHTML = GridArtist.drawOnFreshCanvas(this.bg, { TILEPX: 24, name: this.comptainer + "-grid" })
        // this.update(gridHTML);
        this.redrawList = [];
    }
    init() {
        document.documentElement.style.setProperty('--tileSize', this.TILEPX + 'px');
        document.documentElement.style.setProperty('--totalWidth', this.nWide * (this.TILEPX + this.options.SPACING) + 'px');
        let gridHTML = GridArtist.drawOnFreshCanvas(this.bg, { ...this.options, TILEPX: this.TILEPX, name: "bg" })
        this.append(gridHTML);

        // let html_fg = document.createElement("div");
    }
}



class GridArtist {
    static drawOnFreshCanvas(aGrid, options) {
        let wrapper = document.createElement("div");
        wrapper.id = "freshcanvas_" + options.name;
        GridArtist.makeArt(wrapper, aGrid, options);
        return wrapper;
    }
    static htmlForCell(aGrid, cellname) {
        let cell = document.createElement("div");
        let val = aGrid.map.get(cellname) ? aGrid.map.get(cellname) : -1;
        cell.id = cellname;
        cell.title = cell.id;
        cell.className = "tile level" + val;
        // debugger;
        // Inner cell
        let inner_cell = document.createElement("div");
        inner_cell.id = cellname + "_val";
        // inner_cell.value = val;
        inner_cell.innerText = val;
        if (val === -1) { inner_cell.innerText = `${cellname.split("_")[1]}\n-` };
        inner_cell.className = "tileInner";
        // cell.innerHTML = `<div class=tile2line>${val}</div>`;
        cell.appendChild(inner_cell);
        return cell;
    }
    static makeArt(wrapper, aGrid: Grid, options) {
        let index = 0;

        const marg = options.SPACING;
        wrapper.innerHTML = "";
        wrapper.style.width = `${(options.TILEPX + marg) * aGrid.cols}px`;
        wrapper.style.height = `${(options.TILEPX + marg) * aGrid.rows}px`;

        for (let rows = 0; rows < aGrid.rows; rows++) {
            let row_wrapper = document.createElement("div");
            row_wrapper.id = options.name + "_row_" + rows;
            row_wrapper.style.width = wrapper.style.width;
            // debugger;
            wrapper.appendChild(row_wrapper);
            for (let cols = 0; cols < aGrid.cols; cols++) {
                let cellname = Util.xy2Cell(cols, rows);
                let cell = GridArtist.htmlForCell(aGrid, options.name + "_" + cellname);
                // if (div.innerHTML.length === 0
                //     || div.innerHTML === "undefined") {
                //     div.innerHTML = `<div class=tile2line>${options.name}<br>${cellname}</div>`;
                //     // div.className += " tile2line"
                // }
                // MAPS.id2cell.set(index, cellname);

                // MAPS.cell2val.set(cellname, 0);
                // Utils.update_div_value(div);
                row_wrapper.append(cell);

                index++;
            }
        }
        // console.log(this);
        return wrapper;
    }
    static useStamp(aStamp: Grid, aGrid: Grid) {
        let target_cells = aStamp.map.keys();
        for (const element of target_cells) {
            aGrid.map.set(element, aGrid.map.get(element));
        }
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
    toString(): string {
        let vals = Array.from(this.map.values());
        let result = "{";
        for (let i = 0; i < vals.length; i++) {
            const element = vals[i];
            if (i % this.cols === 0) result += "\n> ";
            result += element;
        }
        return result + "\n}\n";
    }
    toHTML() {
        let art = GridArtist.makeArt(this.name, this, { TILEPX: 24, name: "G" + this.name });

    }
    useStamp(aStamp: Grid) {
        console.log("Applying Stamp=", aStamp.toString())
        console.log("Before:", "Grid=", this.toString());
        console.log("After:", "Grid=", this.toString());
        let target_cells = aStamp.map.keys();

        for (const element of target_cells) {
            if (element === " " || element === ".") continue;
            this.map.set(element, aStamp.map.get(element));
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
    public y: number;
    public reference_grid: Grid;
    constructor(grid = new Grid(5, 5), x = 0, y = 0) {
        this.x = x;
        if (this.x > grid.cols) this.x -= grid.cols;
        this.y = y;
        if (this.y > grid.rows) this.y -= grid.rows;
        this.reference_grid = grid;
    }

    static new_fromCell(grid = new Grid(5, 5), cellname) {
        let regresult = cellname.match(/([A-Z]+)(\d+)/)
        let x = Util.abc2Num(regresult[1])
        let y = Number(regresult[2]);
        let objresult = new Loc(grid, x, y);
        // console.log(regresult)
        // console.log(objresult)

        return objresult;
    }
    static new_fromIndex(grid = new Grid(5, 5), n) {
        return Loc.new_fromCell(grid, Util.n2Cell(n, grid));
    }
    getCellname() {
        return Util.xy2Cell(this.x, this.y);
    }
    getIndex() {
        return this.x + this.y * this.reference_grid.cols;
    }
    shiftIndex(n = 1) {
        let newIndex = this.getIndex() + n;
        if (newIndex < 0 || newIndex >= this.reference_grid.size) return;
        return Loc.new_fromIndex(this.reference_grid, this.getIndex() + n);
    }
    shiftY(n = 1) { return new Loc(this.reference_grid, this.x, this.y + n) };
    shiftX(n = 1) { return new Loc(this.reference_grid, this.x + n, this.y + n) };
}

class Link<T1, T2> {
    A: T1;
    B: T2;
    static allLinks = new Map();
    constructor(A: T1, B: T2) {
        this.A = A;
        this.B = B;
        Link.allLinks.set(A, this);
    }
    static getBfromA(obj) { return Link.allLinks.get(obj) };

    static getAfromB(obj) {
        for (let [key, value] of Link.allLinks.entries()) {
            if (value === obj) return key;
        }
    }

    getPartner(iA) {
        if (typeof (iA) === typeof (this.A)) return this.B;
        else return this.A;
    }
}

class Scene {
    html;
    list_htmlElements: Array<HTMLElement>;
    list_gridElements: Array<Grid>;
    list_names: Array<Link<HTMLElement, Grid>>;

    constructor(name) {
        this.list_htmlElements = [];
        this.list_gridElements = [];
        this.list_names = [];
        let div = document.createElement('div');
        div.id = "scene_" + name;
        this.html = div;
    }
    print(parent_id) {
        const parent = document.getElementById(parent_id);
        parent.innerHTML = this.html.innerHTML;
        this.overlay(parent_id);
    }
    addDiv(name) {
        // let container: HTMLElement = document.getElementById(this.containerName);
        let div = document.createElement('div');
        div.id = name;
        div.className = 'tile level5'
        // div.style.position = 'absolute';
        div.title = name;

        if (this.list_names.indexOf(name) === -1) this.list_names.push(name)
        this.list_htmlElements[name] = div;
        // this.list_connections.push(new Link(div, undefined));
        this.html.appendChild(div);
    }
    addGrid(aGrid, name) {
        this.list_gridElements[name] = aGrid;
        if (this.list_names.indexOf(name) === -1) this.list_names.push(name)

        console.log("connection complete", this, this.list_htmlElements[name]);
        this.drawGrid(name);
    }
    drawGrid(aName) {
        let aGrid = this.list_gridElements[aName];
        let element = this.list_htmlElements[aName];
        let art = GridArtist.makeArt(this.html, aGrid, { TILEPX: 24, name: "G1" });
        // element.appendChild(art);

    }
    overlay(parent_id) {
        let refgrid = document.getElementById("layer_bg");
        const rect = refgrid.getBoundingClientRect();
        // console.log("rect", rect);
        this.html = document.getElementById(parent_id);
        this.html.style.position = "absolute";
        // this.html.style.display = "none";
        this.html.style.left = rect.left;
        this.html.style.top = rect.top;
        // this.html.style.opacity = 0.5;
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - -

class Util {
    static MAPS;
    static GLOB = {
        HEIGHT: 30, //Height / Y
        WIDTH: 20, //Width  / X
        COUNT: 30 * 20,
        REFGRID: new Grid(16, 8),
        TILEPX: 24,
        container_div: "#layer_bg",
        LOWER: "abcdefghijklmnopqrstuvqxyz",
        UPPER: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
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
    static update_div_value(div: Element, val = "default") {
        const cellname = div.id;
        // if (val === "default") {
        //     val = Utils.MAPS.cell2val.get(cellname);
        // } else {
        //     Utils.MAPS.cell2val.set(cellname, val);
        // }
        div.innerHTML = String(val);
        if (div.innerHTML.length === 0
            || div.innerHTML === "undefined") {
            div.innerHTML = div.id;
        }
        // if (div.innerHTML.length === 3) {
        let regresult = cellname.match(/([A-Z]+)(\d+)/);
        let letter = regresult[1];
        let number = Number(regresult[2]);

        div.innerHTML = letter + `<sub style="font-size: 67%">${number}</sub>`;

        // }
        div.className = "tile level" + val;
        // if (Number(val) >= 0 && Number(val) <= 8) div.className = "tile level" + val;
        // animateandqueueremoval(div);
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
        // if (abc.length === 2) return GLOB.UPPER.indexOf(abc.charAt(0)) + GLOB.UPPER.indexOf(abc.charAt(1))

        console.log("error in abc2Num");
        return -1;
    }
    static cell2XY = function (cellname) {

    }
    static xy2Cell = function (x, y) {
        return Util.num2Abc(x).toUpperCase() + y;
    }
    static n2Cell = function (n, aGrid = Util.GLOB.REFGRID) {
        const cols = aGrid.cols;

        // let maptemp = Utils.MAPS.id2cell.get(n);
        // if (maptemp !== undefined) return maptemp;
        let col = Math.floor(n / cols);
        let row = (col > 0) ? n % col : n;
        return Util.xy2Cell(row, col);
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
}