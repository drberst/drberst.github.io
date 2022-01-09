import { Grid, Loc, Util } from "./Classes.js";

export default class SingleLayerComp {
    grid: Grid;
    // fg: Grid;
    nWide: number;
    nTall: number;
    comptainer_id;
    options;
    redrawList: Set<string>;
    constructor(options) {
        this.options = options;
        this.nWide = options.nWide ? options.nWide : 8;
        this.nTall = options.nTall ? options.nTall : 8;
        this.comptainer_id = options.comptainer ? options.comptainer : "compo" + this.nWide + this.nTall;
        this.grid = new Grid(this.nWide, this.nTall);
        this.grid.name = "bg";
        // this.fg = new Grid(this.nWide, this.nTall);
        // this.fg.name = "fg";
        this.redrawList = new Set();
    }

    append(html) {
        const element = Util.$id(this.comptainer_id);
        element.appendChild(html);
    }

    fillWithFunc(aFunc) {
        const grid = this.grid;
        for (let i = 0; i < grid.cols * grid.rows; i++) {
            const cell = Util.n2Cell(i, grid);
            let value = aFunc();
            grid.set(cell, value);
            this.redrawList.add(cell);
        }
    }
    fill(value = undefined) {
        const grid = this.grid;
        for (let i = 0; i < grid.cols * grid.rows; i++) {
            const cell = Util.n2Cell(i, grid);
            grid.set(cell, value);
            this.redrawList.add(cell);
        }
        // this.bg.map.forEach((val, key) => {
        //     this.redrawList.add(key);
        // });
    }

    get(key: string) {
        const value = this.grid.get(key);
        if (value == null) console.log(key, "wasn't found in", this.grid);
        return this.grid.get(key);
    }
    set(key, val) {
        const [x, y] = Util.cell2Xy(key, this.grid);
        const prev_val = this.grid.get(key);

        if (x > this.nWide || y > this.nTall || prev_val == undefined) {
            console.error("can't set", val, "to key", key, "because it out of range of", x, y)
            // debugger;
        } else if (val === prev_val) {

        } else {

            this.grid.set(key, val);
            this.redrawList.add(key);
        }
    }
    getKeys() {
        return this.grid.map.keys;
    }
    queue_redraw(key) {
        this.redrawList.add(key);
    }

    refresh() {
        // console.time();
        // console.log("Drawing:", this.redrawList.size, "elements");
        // Util.out("Drawing:" + this.redrawList.size + "elements");

        this.redrawList.forEach(id => {
            let element = Util.$id(id);
            if (element) {
                let result = GridArtist.htmlForCell(this.grid, id);
                element.replaceWith(result);
            }
            else {
                console.error("null value in refresh", id);
                debugger;
            }
        });
        this.redrawList = new Set();
    }
    init(n?) {
        // document.documentElement.style.setProperty('--tileSize', this.TILEPX + 'px');
        // document.documentElement.style.setProperty('--totalWidth', this.nWide * (this.TILEPX + this.options.SPACING) + 'px');
        // document.documentElement.style.setProperty('--compTop', this.nWide * (this.TILEPX + this.options.SPACING) + 'px');
        // let gridHTML = GridArtist.drawOnFreshCanvas(this.bg, { ...this.options, TILEPX: this.TILEPX, name: "bg" })
        // this.append(gridHTML);
        this.fill(n);
        GridArtist.fillWrapperWithGrid(this.comptainer_id, this.grid)
        // let html_fg = document.createElement("div");
    }
    size() {
        return this.nWide * this.nTall;
    }
}



class GridArtist {
    static useset;// = "braille2";
    static valsets = {
        braille: "⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿".split(""),
        braille2: "⠠⠤⠴⠶⠾⠿".split("")
    }

    static htmlForCell(aGrid, cellname) {
        let cell = document.createElement("div");
        let val = aGrid.get(cellname);
        // if (val === undefined) val = -1;
        cell.id = cellname;
        cell.title = cellname + "-" + String(Loc.new_fromCell(aGrid, cellname).getIndex());
        cell.className = "tile";
        if (val >= 0) {

            let [h, s, l] = [val / 100 * 360, 50, val / 100 * 45 + 5];
            if (GridArtist.useset !== undefined) {
                const len = GridArtist.valsets[GridArtist.useset].length;
                s = 50;
                h = .3 * 360;
                l = 25 + (1 - val / len) * 30;
                // Util.out(val);
                // debugger;
            }
            cell.style.backgroundColor = `hsl(${h}, ${s}%, ${l}%)`;
            // if (frequencyData[i] > 200) debugger;
            // const [r, g, b] = Util.audio.hslToRgb(h, s, l);
            // cell.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        }
        // debugger;
        // Inner cell
        let inner_cell = document.createElement("div");
        inner_cell.id = cellname + "_val";
        // inner_cell.value = val;
        if (val === -1 || val === undefined) {
            inner_cell.innerText = "";
            // inner_cell.innerText = cellname;
        } else if (GridArtist.useset !== undefined) {
            inner_cell.innerText = GridArtist.valsets[GridArtist.useset][val];
        } else {
            // inner_cell.innerText = val;
        }
        inner_cell.className = "tileInner";

        cell.appendChild(inner_cell);
        return cell;
    }

    static fillWrapperWithGrid(wrapper: HTMLElement, aGrid: Grid, options?): HTMLElement {
        if (typeof wrapper === 'string') {
            wrapper = Util.$id(wrapper);
        }
        wrapper.innerHTML = "";
        wrapper.style.gridTemplateColumns = `repeat(${aGrid.cols},1fr)`;
        wrapper.style.gridTemplateRows = `repeat(${aGrid.rows},1fr)`;

        console.log("Filling wrapper with grid=", aGrid)

        for (let i = 0; i < aGrid.size(); i++) {
            // setTimeout(() => {
            let cellname = Util.n2Cell(i, aGrid);
            let cell = GridArtist.htmlForCell(aGrid, cellname);
            // console.log(i, cellname, cell)
            wrapper.append(cell);
            // }, i * 50)
        }
        return wrapper;
    }
};