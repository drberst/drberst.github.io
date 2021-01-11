let PBN = new Map();
let DIVMAP = new Map();
let ALPHA = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
let COLS = 26;
let ROWS = 10;
globalThis.g = { PBN, DIVMAP, COLS, ROWS };
for (let i = 0; i < ALPHA.length; i++) {
    for (let ii = 0; ii < 10; ii++) {
        const element = ALPHA[i] + ii;
        PBN.set(element, 0);
    }
}
console.log("test", globalThis.g);
class printer {
    constructor() {
        this.container_div = "#grid_container";
    }
    ;
    init() {
        let index = 0;
        let aPage = document.querySelector(this.container_div);
        this.MAX = ROWS * COLS;
        this.count = 0;
        for (let rows = 0; rows < ROWS; rows++) {
            for (let cols = 0; cols < COLS; cols++) {
                let cellname = Utils.xy2Cell(cols, rows);
                let div = document.createElement('div');
                div.id = String(index);
                div.innerHTML = cellname;
                div.title = String(index);
                div.className = "tile";
                setTimeout(function () {
                    aPage.append(div);
                }, (5000 / this.MAX) * index);
                index++;
                this.count++;
            }
        }
    }
    framelen(n = 5000) {
        return n / this.count;
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
let mainprinter = new printer();
mainprinter.init();
