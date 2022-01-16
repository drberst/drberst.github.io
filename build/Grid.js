import { Util } from "./Classes.js";
export { Loc, Grid };
export default class Grid {
    constructor(x = 8, y = 8) {
        this.map = new Map();
        this.cols = x;
        this.rows = y;
        this.name = "G" + Grid.idcount++;
        console.log(this);
    }
    static fromAscii(iAscii) {
        let result = new Grid(iAscii.length, iAscii[0].length);
        result.fromAscii(iAscii);
        return result;
    }
    init(val = 0) {
        for (let i = 0; i < this.cols * this.rows; i++) {
            this.map.set(Util.n2Cell(i, this), val);
        }
    }
    get(key) {
        if (key.includes("_")) {
            console.log("got one at GET! key=", key);
            debugger;
            return this.map.get(key.split("_")[1]);
        }
        else
            return this.map.get(key);
    }
    set(key, val) {
        if (key.includes("_")) {
            console.log("got one at SET! key=", key);
            this.map.set(key.split("_")[1], val);
        }
        else
            this.map.set(key, val);
    }
    size() {
        return this.map.size;
    }
    atLoc(Location) {
        return this.get(Location.getCellname());
    }
    locate(key) {
        return Loc.new_fromCell(this, key);
    }
    toString() {
        let vals = Array.from(this.map.values());
        let result = "{\n";
        for (let i = 0; i < vals.length; i++) {
            const element = vals[i];
            if (i % this.cols === 0)
                result += "\n> ";
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
    useStamp(aStamp) {
        let target_cells = aStamp.map.keys();
        for (const element of target_cells) {
            if (element === " " || element === ".")
                continue;
            this.map.set(element, aStamp.get(element));
        }
    }
    fromAscii(iAscii, origin = new Loc(this.cols, this.rows, 0, 0)) {
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
                if (element !== ".") {
                    result.push(cellname);
                    this.map.set(cellname, element);
                }
                currentcell.shiftIndex(1);
            }
            currentcell.shiftIndex(this.cols);
        }
        console.log("Ascii done...", result);
        return result;
    }
}
Grid.idcount = 0;
class Loc {
    constructor(cols = 5, rows = 5, x = 0, y = 0) {
        this.x = x;
        if (this.x > cols)
            this.x -= cols;
        if (this.x < 0)
            this.x += cols;
        this.y = y;
        if (this.y > rows)
            this.y -= rows;
        if (this.y < 0)
            this.y += rows;
        this.max_x = cols;
        this.max_y = rows;
    }
    static new_fromGrid(grid = new Grid(5, 5), x, y) {
        let result = new Loc();
        result.x = x;
        if (result.x > grid.cols)
            result.x -= grid.cols;
        if (result.x < 0)
            result.x += grid.cols;
        result.y = y;
        if (result.y > grid.rows)
            result.y -= grid.rows;
        if (result.y < 0)
            result.y += grid.rows;
        result.max_x = grid.cols;
        result.max_y = grid.rows;
        return result;
    }
    static new_fromCell(grid = new Grid(5, 5), cellname) {
        let regresult = cellname.match(/([A-Z]+)(\d+)/);
        let x = Util.abc2Num(regresult[1]);
        let y = Number(regresult[2]);
        return Loc.new_fromGrid(grid, x, y);
    }
    static new_fromIndex(grid = new Grid(5, 5), n) {
        let [x, y] = Util.n2Xy(n, grid);
        return Loc.new_fromGrid(grid, x, y);
    }
    getCellname() {
        return Util.xy2Cell(this.x, this.y);
    }
    getIndex() {
        return this.x + this.y * this.max_x;
    }
    shiftIndex(n = 1) {
        let newIndex = this.getIndex() + n;
        if (newIndex < 0 || newIndex >= this.max_x * this.max_y)
            return;
        return Loc.new_fromIndex(new Grid(this.max_x, this.max_y), newIndex);
    }
    shiftX(n = 1) {
        this.x += n;
        while (this.x >= this.max_x)
            this.x -= this.max_x;
        while (this.x < 0)
            this.x += this.max_x;
    }
    shiftY(n = 1) {
        this.y += n;
        while (this.y >= this.max_y)
            this.y -= this.max_y;
        while (this.y < 0)
            this.y += this.max_y;
    }
    shiftXY(nx, ny) {
        this.shiftX(nx);
        this.shiftY(ny);
    }
    get8Neighbors() {
        let result = [];
        let i = 0;
        for (let y = -1; y <= 1; y++) {
            for (let x = -1; x <= 1; x++) {
                if (!(x === 0 && y === 0)) {
                    let obj = new Loc(this.max_x, this.max_y, this.x, this.y);
                    obj.shiftXY(x, y);
                    result[i++] = obj.getCellname();
                }
            }
        }
        return result;
    }
    toString() {
        return this.getCellname();
    }
}
class GridArtist {
    static htmlForCell(aGrid, cellname) {
        let cell = document.createElement("div");
        let val = aGrid.get(cellname);
        cell.id = cellname;
        let potentialTitle = aGrid[cellname + "-title"];
        if (typeof potentialTitle !== "undefined") {
            cell.title = potentialTitle;
        }
        else
            cell.title = cellname + "-" + String(Loc.new_fromCell(aGrid, cellname).getIndex());
        cell.className = "tile";
        const colorVal = (val);
        if (val >= 0) {
            const max = 1;
            let [h, s, l] = [colorVal / max * 360 + 100, 80, colorVal / max * 50];
            if (GridArtist.useset !== undefined) {
                const len = GridArtist.valsets[GridArtist.useset].length;
                s = 50;
                h = .3 * 360;
                l = 25 + (1 - val / len) * 30;
            }
            cell.style.backgroundColor = `hsl(${h}, ${s}%, ${l}%)`;
        }
        let inner_cell = document.createElement("div");
        inner_cell.id = cellname + "_val";
        if (val === -1 || val === undefined) {
            inner_cell.innerText = cellname;
        }
        else if (GridArtist.useset !== undefined) {
            inner_cell.innerText = GridArtist.valsets[GridArtist.useset][val];
        }
        else {
            inner_cell.innerText = Math.round(colorVal * 100) / 100 + "";
        }
        inner_cell.className = "tileInner";
        cell.appendChild(inner_cell);
        return cell;
    }
    static fillWrapperWithGrid(wrapper, aGrid, options) {
        if (typeof wrapper === 'string') {
            wrapper = Util.$id(wrapper);
        }
        wrapper.innerHTML = "";
        wrapper.style.gridTemplateColumns = `repeat(${aGrid.cols},1fr)`;
        wrapper.style.gridTemplateRows = `repeat(${aGrid.rows},1fr)`;
        console.log("Filling wrapper with grid=", aGrid);
        for (let i = 0; i < aGrid.size(); i++) {
            let cellname = Util.n2Cell(i, aGrid);
            let cell = GridArtist.htmlForCell(aGrid, cellname);
            wrapper.append(cell);
        }
        return wrapper;
    }
}
GridArtist.valsets = {
    braille: "⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿".split(""),
    braille2: "⠠⠤⠴⠶⠾⠿".split("")
};
//# sourceMappingURL=Grid.js.map