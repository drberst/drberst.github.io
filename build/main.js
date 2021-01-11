let PBN = new Map();
let DIVMAP = new Map();
let ALPHA = ["ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
let COLS = 8;
let ROWS = 8;
for (let i = 0; i < ALPHA.length; i++) {
    for (let ii = 0; ii < 10; ii++) {
        const element = ALPHA[i] + ii;
        PBN.set(element, 0);
    }
}
console.log("test", globalThis.g);
class HtmlPrinter {
    constructor() {
        this.container_div = "#grid_container";
    }
    init() {
        let index = 0;
        let aPage = document.querySelector(this.container_div);
        this.MAX = ROWS * COLS;
        this.count = 0;
        HtmlPrinter.divpool = new Map();
        for (let rows = 0; rows < ROWS; rows++) {
            for (let cols = 0; cols < COLS; cols++) {
                let cellname = Utils.xy2Cell(cols, rows + 1);
                let div = document.createElement("div");
                div.id = String(index);
                div.innerHTML = 0;
                div.title = String(index);
                div.className = "tile";

                div.onclick = HtmlPrinter.defaultonclickfunction;

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
HtmlPrinter.defaultonclickfunction = function () {
    this.classList.toggle("tile");
};
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
    if (num < len || num < 0) return alphabet.charAt(num);
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
        return input + padding.repeat(b - input.length).slice(-b);
    }
    return (padding.repeat(length) + input).slice(-length);
};
Utils.clean = function (element) {
    element.classList.remove("tileHighlight");
    element.style = "huh";
};
function main() {
    document.documentElement.style.setProperty("--totalWidth", COLS * 24 + "px");
    let mainprinter = new HtmlPrinter();
    mainprinter.init();
    document.getElementById("clickMe").onclick = function () {
        let n = ROWS * COLS;
        for (let i = 0; i < n; i++) {
            setTimeout(function () {
                let id = Math.floor(Math.random() * n);
                let tile = document.getElementById(id);
                console.log("BUTTON ACTIVATION", "target=", tile);
                tile.innerHTML = `${Number(tile.innerHTML) + 1}`;
                tile.classList.toggle("tileHighlight");
            }, (2000 / n) * i);
        }
    };
    globalThis.g = { PBN, DIVMAP, COLS, ROWS, HtmlPrinter };
}
main();
