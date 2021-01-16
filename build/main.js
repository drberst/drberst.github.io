var PBN = new Map();
let DIVMAP = new Map();
let ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("");
let COLS = 8;
let ROWS = 8;
var animationqueue = 0;
for (let i = 0; i < COLS; i++) {
    for (let ii = 0; ii < ROWS; ii++) {
        const element = ALPHA[i] + (ii + 1);
        PBN.set(element, ii);
    }
}
console.log("test", globalThis.g);
function update_div_value(div) {
    const cellname = div.title;
    let value = PBN.get(cellname);
    if (value === undefined)
        value = -1;
    div.innerHTML = String(value);
    div.className = "tile level" + value;
    div.style.boxShadow = `inset 0px ${-value}px ${value + 2}px  #DDD`;
    animateandqueueremoval(div);
}
function animateandqueueremoval(tile) {
    tile.classList.remove("tileHighlight");
    setTimeout(function () {
        tile.classList.add("tileHighlight");
        animationqueue--;
    }, 1 + 5 * animationqueue++);
}
function defaultonclickfunction(event) {
    let cell = event.currentTarget.title;
    let val = PBN.get(cell);
    let delta = 1;
    if (event.type === "wheel") {
        event.preventDefault();
        if (event.deltaY > 0)
            delta *= -1;
    }
    PBN.set(cell, val + delta);
    update_div_value(event.currentTarget);
}
class HtmlPrinter {
    constructor() {
        this.container_div = "#grid_container";
    }
    ;
    init() {
        let index = 0;
        let aPage = document.querySelector(this.container_div);
        this.MAX = ROWS * COLS;
        this.count = 0;
        HtmlPrinter.divpool = new Map();
        for (let rows = 0; rows < ROWS; rows++) {
            for (let cols = 0; cols < COLS; cols++) {
                let cellname = Utils.xy2Cell(cols, rows + 1);
                let div = document.createElement('div');
                div.id = String(index);
                div.title = cellname;
                div.tabIndex = 0;
                div.onclick = defaultonclickfunction;
                div.onwheel = defaultonclickfunction;
                update_div_value(div);
                setTimeout(function () {
                    aPage.append(div);
                }, this.framelen(1000) * index);
                HtmlPrinter.divpool.set(cellname, div);
                index++;
                this.count++;
            }
        }
    }
    framelen(n = 1000) {
        return n / this.MAX;
    }
}
;
class Utils {
    static isNull(element) {
        return element === undefined;
    }
    static isDefined(element) {
        return !Utils.isNull(element);
    }
}
Utils.numToAbc = function (num) {
    const alphabet = "abcdefghijklmnopqrstuvqxyz";
    const len = alphabet.length;
    if (num < len || num < 0)
        return alphabet.charAt(num);
    let tens = Math.floor(num / len);
    let result = alphabet.charAt(tens - 1) + Utils.numToAbc(num % len);
    return result;
};
Utils.xy2Cell = function (x, y) {
    return Utils.numToAbc(x).toUpperCase() + y;
};
Utils.toFixedLength = function (input, length, padding) {
    padding = padding || "0";
    if (length <= 0) {
        let b = -1 * length;
        return (input + padding.repeat(b - input.length).slice(-b));
    }
    return (padding.repeat(length) + input).slice(-length);
};
Utils.clean = function (element) {
    element.classList.remove('tileHighlight');
    element.style = "huh";
};
function highlightRandom() {
    let n = ROWS * COLS - 1;
    for (let i = 0; i < 5; i++) {
        let id = `${Math.floor(Math.random() * n)}`;
        let tile = document.getElementById(id);
        tile.click();
        animateandqueueremoval(tile);
    }
}
function main() {
    let pxsize = 24;
    document.documentElement.style.setProperty('--tileSize', pxsize + 'px');
    document.documentElement.style.setProperty('--totalWidth', COLS * (pxsize + 2) + 'px');
    let mainprinter = new HtmlPrinter();
    mainprinter.init();
    document.getElementById("clickMe").onclick = highlightRandom;
    let tt = new Tool();
    globalThis.g = { PBN, DIVMAP, COLS, ROWS, HtmlPrinter, Tool, tt };
    console.log("Done setting up:", globalThis.g);
}
class Tool {
    speak() {
        console.log("I have spoken");
    }
}
main();
