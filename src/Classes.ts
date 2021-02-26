export { Loc, Grid, Scene, Link };

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
        let x = Utils.abc2Num(regresult[1])
        let y = Number(regresult[2]);
        let objresult = new Loc(grid, x, y);
        // console.log(regresult)
        // console.log(objresult)

        return objresult;
    }
    static new_fromIndex(grid = new Grid(5, 5), n) {
        return Loc.new_fromCell(grid, Utils.n2Cell(n, grid));
    }
    getCellname() {
        return Utils.xy2Cell(this.x, this.y);
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

class Grid {
    static idcount = 0;
    rows;
    cols;
    map: Map<string, number>;
    size;
    name;

    constructor(x = 8, y = 8) {
        this.map = new Map();
        this.rows = x;
        this.cols = y;
        this.size = x * y;
        this.name = Grid.idcount++;
        // this.init();
    }
    static fromAscii(iAscii: Array<String>) {
        let result = new Grid(iAscii.length, iAscii[0].length);
        result.fromAscii(iAscii);
        return result;
    }
    init(val = 0) {
        for (let i = 0; i < this.cols * this.rows; i++) {
            this.map.set(Utils.n2Cell(i, this), val);
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
                const cellname = Utils.xy2Cell(nChar + hOffset, i + vOffset);
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

let GridArtist = {


    makeArt(wrapper, aGrid, options) {
        let index = 0;
        // let wrapper: HTMLElement = options;
        const marg = 0; //0px
        wrapper.innerHTML = "";
        wrapper.style.width = `${(options.TILEPX + marg) * aGrid.cols}px`;
        wrapper.style.height = `${(options.TILEPX + marg) * aGrid.rows}px`;

        this.MAX = aGrid.rows * aGrid.cols;

        for (let rows = 0; rows < aGrid.rows; rows++) {
            let row_wrapper = document.createElement("div");
            row_wrapper.id = options.name + "_row_" + rows;
            wrapper.appendChild(row_wrapper);
            for (let cols = 0; cols < aGrid.cols; cols++) {
                let cellname = Utils.xy2Cell(cols, rows);
                let div = document.createElement("div");

                div.id = options.name + "_" + cellname;
                div.title = div.id;

                let val = aGrid.map.get(cellname);
                if (val) div.innerHTML = `<div class=tile2line>${val}</div>`;
                else div.innerHTML = `<div class=tile2line>${options.name}<br>${cellname}</div>`;
                div.className = "tile level" + val;
                // if (div.innerHTML.length === 0
                //     || div.innerHTML === "undefined") {
                //     div.innerHTML = `<div class=tile2line>${options.name}<br>${cellname}</div>`;
                //     // div.className += " tile2line"
                // }
                // MAPS.id2cell.set(index, cellname);

                // MAPS.cell2val.set(cellname, 0);
                // Utils.update_div_value(div);
                row_wrapper.append(div);

                index++;
            }
        }
        // console.log(this);
        return wrapper;
    },
    useStamp(aStamp: Grid, aGrid: Grid) {
        let target_cells = aStamp.map.keys();
        for (const element of target_cells) {
            aGrid.map.set(element, aGrid.map.get(element));
        }
    }
};



// - - - - - - - - - - - - - - - - - - - - - - - -

class Utils {
    static MAPS;
    static GLOB = {
        HEIGHT: 30, //Height / Y
        WIDTH: 20, //Width  / X
        COUNT: 30 * 20,
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
        const len = Utils.GLOB.UPPER.length;

        if (num < len && num >= 0) return Utils.GLOB.UPPER.charAt(num);
        if (num - 26 >= 0) return Utils.GLOB.UPPER.charAt(num - 26) + Utils.num2Abc(num - 26);
        console.log("num2abcfail", num)
        return "null";
    }
    static abc2Num = function (abc) {
        // const Utils.GLOB.UPPER = "abcdefghijklmnopqrstuvqxyz";
        abc = abc.toUpperCase();
        if (abc.length === 1) return Utils.GLOB.UPPER.indexOf(abc);
        // if (abc.length === 2) return GLOB.UPPER.indexOf(abc.charAt(0)) + GLOB.UPPER.indexOf(abc.charAt(1))

        console.log("error in abc2Num");
        return -1;
    }
    static cell2XY = function (cellname) {

    }
    static xy2Cell = function (x, y) {
        return Utils.num2Abc(x).toUpperCase() + y;
    }
    static n2Cell = function (n, aGrid: Grid) {
        const cols = aGrid.cols;

        // let maptemp = Utils.MAPS.id2cell.get(n);
        // if (maptemp !== undefined) return maptemp;
        let col = Math.floor(n / cols);
        let row = (col > 0) ? n % col : n;
        return Utils.xy2Cell(row, col);
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
        return !Utils.isNull(element);
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
                    result.push(Utils.xy2Cell(nChar + hOffset, i + vOffset));
                }
                currentcell.shiftIndex(1);
            }
            currentcell.shiftIndex(Utils.GLOB.WIDTH);
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