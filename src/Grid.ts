import { Util } from "./Classes.js";

export { Loc, Grid }
export default class Grid {
    static idcount = 0;
    rows;
    cols;
    map: Map<string, number>;
    // size;
    name;

    constructor(x = 8, y = 8) {
        this.map = new Map();
        this.cols = x;
        this.rows = y;
        // this.size = x * y;
        this.name = "G" + Grid.idcount++;
        console.log(this)
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
    size() {
        return this.map.size;
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

    averageValue() {
        let vals = Array.from(this.map.values());
        let result = 0.0;
        for (let i = 0; i < vals.length; i++) {
            result += vals[i];
        }
        return result / vals.length;
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
