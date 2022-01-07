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
    fill(value = 0) {
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
    // static fixkey(aKey) {
    //     let parts = aKey.split("_");
    //     if(parts.length > 0)
    // }

    get(key: string) {
        return this.grid.get(key);
    }
    set(key, val) {
        const index = Util.cell2n(key, this.grid);
        if (index > this.size()) {
            debugger;
        }
        this.grid.set(key, val);
        this.redrawList.add(key);
    }
    queue_redraw(key) {
        this.redrawList.add(key);
    }
    // refresh2() {
    //     // console.log("Drawing:", this.redrawList.size, "elements");
    //     // console.timeStamp;

    //     GridArtist.fillWrapperWithGrid(Util.$id(this.comptainer_id), this.grid, { ...this.options, TILEPX: this.TILEPX, name: "bg" })
    //     // let node = Util.$id(this.comptainer_id); debugger;
    //     // node.innerHTML = gridHTML.innerHTML;
    //     // Util.$id(this.comptainer_id).replaceWith(gridHTML);

    //     this.redrawList = new Set();
    //     // console.log(console.timeEnd());

    // }

    refresh() {
        // console.time();
        // console.log("Drawing:", this.redrawList.size, "elements");

        this.redrawList.forEach(id => {
            // const bgid = "bg_"+id
            let element = Util.$id(id);
            if (element) {
                // debugger;
                let result = GridArtist.htmlForCell(this.grid, id);
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
        // document.documentElement.style.setProperty('--tileSize', this.TILEPX + 'px');
        // document.documentElement.style.setProperty('--totalWidth', this.nWide * (this.TILEPX + this.options.SPACING) + 'px');
        // document.documentElement.style.setProperty('--compTop', this.nWide * (this.TILEPX + this.options.SPACING) + 'px');
        // let gridHTML = GridArtist.drawOnFreshCanvas(this.bg, { ...this.options, TILEPX: this.TILEPX, name: "bg" })
        // this.append(gridHTML);
        GridArtist.fillWrapperWithGrid(this.comptainer_id, this.grid, { ...this.options, name: "bg" })
        // let html_fg = document.createElement("div");
    }
    size() {
        return this.nWide * this.nTall;
    }
}



class GridArtist {
    static htmlForCell(aGrid, cellname) {
        let cell = document.createElement("div");
        let val = aGrid.get(cellname);
        if (val === undefined) val = -1;
        cell.id = cellname;
        cell.title = String(Loc.new_fromCell(aGrid, cellname).getIndex() + 1);
        // cell.className = "tile level" + val;
        cell.className = "tile";
        if (val >= 0) {
            // const h = 0 + (val / 100) * 60;
            // const s = 70;
            // const l = (val < 25) ? 30 + val / 8 : 10 + val * .9;
            // cell.style.color = "red";
            // cell.style.backgroundColor = "hsl(" + val * 3.6 + ", 60%, " + (30 + val / 3) + "%)";
            const [h, s, l] = [val + 100, 50, val / 255 * 45 + 5];

            // if (frequencyData[i] > 200) debugger;
            const [r, g, b] = Util.audio.hslToRgb(h, s, l);
            // cell.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            cell.style.backgroundColor = `hsl(${h}, ${s}%, ${l}%)`;
        } else if (val == 0) {

        }
        // debugger;
        // Inner cell
        let inner_cell = document.createElement("div");
        inner_cell.id = cellname + "_val";
        // inner_cell.value = val;
        inner_cell.innerText = val;
        if (val === -1 || val === 0) {
            inner_cell.innerText = cellname + "\n" + cell.title;
        }
        inner_cell.className = "tileInner";
        // cell.innerHTML = `<div class=tile2line>${val}</div>`;
        cell.appendChild(inner_cell);
        return cell;
    }

    static fillWrapperWithGrid(wrapper: HTMLElement, aGrid: Grid, options): HTMLElement {
        let index = 0;
        if (typeof wrapper === 'string') {
            wrapper = Util.$id(wrapper);
        }
        // const marg = options.SPACING;
        wrapper.innerHTML = "";
        wrapper.style.gridTemplateColumns = `repeat(${aGrid.cols},1fr)`;
        wrapper.style.gridTemplateRows = `repeat(${aGrid.rows},1fr)`;

        // : repeat(10, 1fr);
        // grid - template - rows: repeat(10, 1fr);
        // wrapper.style.width = `${(options.TILEPX + marg) * aGrid.cols}px`;
        // wrapper.style.height = `${(options.TILEPX + marg) * aGrid.rows}px`;
        console.log("Filling wrapper with grid=", aGrid)

        // for (let rows = 0; rows < aGrid.rows; rows++) {
        // let row_wrapper = document.createElement("span");
        // row_wrapper.id = options.name + "_row_" + rows;
        // row_wrapper.style.width = options.TILEPX * aGrid.cols + "px"; //+wrapper.style.width;
        // row_wrapper.style.height = options.TILEPX + "px";
        // row_wrapper.style.height = options.TILEPX + "px";
        // row_wrapper.style.display = "inline";
        // debugger;
        // wrapper.appendChild(row_wrapper);
        for (let i = 0; i < aGrid.size; i++) {
            setTimeout(() => {
                let cellname = Util.n2Cell(i, aGrid);
                let cell = GridArtist.htmlForCell(aGrid, cellname);
                console.log(i, cellname, cell)
                wrapper.append(cell);
                index++;
            }, i * 50)
        }
        // }
        // console.log(this);
        return wrapper;
    }
};