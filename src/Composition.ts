import { Grid, Loc, Util } from "./Classes.js";

export default class Composition {
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
        console.log(this)
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
        Util.setIntervalX(function () {
            // console.log(thiscomp, "game round:", count++, "before", thiscomp.bg.toString());
            thiscomp.gameOfLifeRound();
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
        const index = Util.cell2n(key, this.bg);
        if (index > this.size()) {
            debugger;
        }
        this.bg.set(key, val);
        this.redrawList.add(key);
    }
    queue_redraw(key) {
        this.redrawList.add(key);
    }
    refresh2() {
        // console.log("Drawing:", this.redrawList.size, "elements");
        // console.timeStamp;

        GridArtist.fillWrapperWithGrid(Util.$id(this.comptainer_id), this.bg, { ...this.options, TILEPX: this.TILEPX, name: "bg" })
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
        GridArtist.fillWrapperWithGrid(this.comptainer_id, this.bg, { ...this.options, TILEPX: this.TILEPX, name: "bg" })
        document.documentElement.style.setProperty('--rows', this.nTall + '');
        document.documentElement.style.setProperty('--cols', this.nWide + '');
        console.log("rows:", document.documentElement.style.getPropertyValue('--rows'));
        console.log("cools", document.documentElement.style.getPropertyValue('--cols'));

        // let html_fg = document.createElement("div");
    }
    size() {
        return this.nWide * this.nTall;
    }
    changeOptions(options) {
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


}



class GridArtist {
    static htmlForCell(aGrid, cellname) {
        let cell = document.createElement("div");
        let val = aGrid.get(cellname);
        if (val === undefined) val = -1;
        cell.id = cellname;
        cell.title = String(Loc.new_fromCell(aGrid, cellname).getIndex());
        // cell.className = "tile level" + val;
        cell.className = "tile";
        console.log(aGrid)
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
        const marg = options.SPACING;
        wrapper.innerHTML = "";
        // wrapper.style.width = `${(options.TILEPX + marg) * aGrid.cols}px`;
        // wrapper.style.height = `${(options.TILEPX + marg) * aGrid.rows}px`;


        for (let rows = 0; rows < aGrid.rows; rows++) {
            let row_wrapper = document.createElement("div");
            row_wrapper.id = options.name + "_row_" + rows;
            // row_wrapper.style.width = options.TILEPX * aGrid.cols + "px"; //+wrapper.style.width;
            // row_wrapper.style.height = options.TILEPX + "px";
            // row_wrapper.style.height = "50px";
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