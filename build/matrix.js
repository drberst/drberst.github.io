import Utils from "./utils.js";
import PosBuilder from "./builders2.js";
export default class Matrix {
    constructor(rows, cols, container, data) {
        this.rows = rows;
        this.cols = cols;
        this.container = container;
        Utils.isNull(data) ? this.data = new Array(rows * cols).fill("x", 0, rows * cols) : data;
        this.str = this.toString();
    }
    static from(input) {
        return { ...input };
    }
    get(n) { return this.data[n]; }
    set(n, value) { this.data[n] = value; }
    getXY(x, y) {
        return this.get(x * this.rows + y);
    }
    setXY(x, y, value) {
        this.set(x * this.rows + y, value);
    }
    toString() {
        let head = "<br><br>";
        let tail = "";
        let colwidth = 4;
        let rowbg = '\xa0';
        let colbg = '\xa0';
        let matbg = "\xa0";
        let sequence = Array.from(Array(this.cols).keys());
        sequence.forEach(n => {
            let temp = rowbg.repeat(colwidth - 2) + Utils.toFixedLength(n, 2, "c");
            head += temp;
        });
        for (let i = 0; i < this.data.length; i++) {
            const element = this.data[i];
            let temp = "";
            if (i % this.cols === 0) {
                temp = Utils.toFixedLength(sequence[i / this.cols], 2, "r");
                let newrow = "<br>";
                head += newrow + temp + "| ";
            }
            temp = Utils.toFixedLength(element, 2);
            temp = Utils.toFixedLength(temp, -colwidth, matbg);
            head += `${temp}`;
        }
        let s3 = head + tail;
        return s3;
    }
}
Matrix.default = { cols: 4, rows: 4, id: "#" };
class Matrix_Helpers {
    constructor(aMatrix) {
        this.M = aMatrix;
    }
    getColumn(n) {
        let result = [];
        for (let i = 0; i < this.M.rows; i++) {
            result[i] = this.M.data[this.M.cols * i + n];
        }
        return result;
    }
    getRow(n) {
        let result = [];
        for (let i = 0; i < this.M.cols; i++) {
            result[i] = this.M.data[this.M.cols * n + i];
        }
        return result;
    }
    setCol(n, data) {
        for (let i = 0; i < this.M.rows; i++) {
            this.M.set(this.M.cols * i + n, data[i]);
        }
    }
    setRow(n, data) {
        for (let i = 0; i < this.M.cols; i++) {
            this.M.set(this.M.cols * n + i, data[i]);
        }
    }
    fill(n) {
        let size = (this.M.data.length > 0) ? this.M.data.length : this.M.rows * this.M.cols;
        for (let i = 0; i < size; i++) {
            let x = this.M.data[i];
            if (x === undefined) {
                this.M.data[i] = Math.random() * 10;
            }
            else {
                return this.M.data[i] = n;
            }
        }
        return this.M;
    }
    print() {
        let result = "";
        let head = "_______________________________<br><code>";
        let tail = "</code><br>";
        let colwidth = 4;
        let rowbg = '\xa0';
        let colbg = '\xa0';
        let matbg = "\xa0";
        let sequence = Array.from(Array(this.M.cols).keys());
        head += colbg.repeat(colwidth - 2);
        sequence.forEach(n => {
            let temp = rowbg.repeat(colwidth - 2) + Utils.toFixedLength(n, 2, "c");
            head += temp;
        });
        for (let i = 0; i < this.M.data.length; i++) {
            const element = this.M.data[i];
            let temp = "";
            if (i % this.M.cols === 0) {
                temp = Utils.toFixedLength(sequence[i / this.M.cols], 2, "r");
                let newrow = "<br>";
                head += newrow + temp + " |";
            }
            temp = Utils.toFixedLength(element, 2);
            temp = Utils.toFixedLength(temp, -colwidth, matbg);
            head += `${temp}`;
        }
        let s3 = head + tail;
        return s3;
        document.querySelector(this.M.container).innerHTML += s3;
    }
    save() {
        return { ...this.M };
    }
}
let util = function (arg) {
    let myParent = arg;
    let result = {
        ...arg,
        get: {
            col(n) {
                let result = [];
                for (let i = 0; i < this.rows; i++) {
                    result[i] = this.data[this.cols * i + n];
                }
                return result;
            },
            row(n) {
                let result = [];
                for (let i = 0; i < this.cols; i++) {
                    result[i] = this.data[this.cols * n + i];
                }
                return result;
            }
        },
        set: {
            col(n, data) {
                for (let i = 0; i < this.rows; i++) {
                    this.data[this.cols * i + n] = data[i];
                }
                return this.data;
            },
            row(n, data) {
                for (let i = 0; i < this.cols; i++) {
                    this.data[this.cols * n + i] = data[i];
                }
                return this.data;
            }
        },
        remove: {},
        add: {},
        fill(n) {
            let size = (this.data.length > 0) ? this.data.length : this.rows * this.cols;
            for (let i = 0; i < size; i++) {
                let x = this.data[i];
                if (x === undefined) {
                    this.data[i] = Math.random() * 10;
                }
                else {
                    return this.data[i] = n;
                }
            }
            return this;
        },
        print() {
            let head = "_______________________________<br><code>";
            let tail = "</code><br>";
            let colwidth = 4;
            let rowbg = '\xa0';
            let colbg = '\xa0';
            let matbg = "\xa0";
            let sequence = Array.from(Array(this.cols).keys());
            head += colbg.repeat(colwidth - 2);
            sequence.forEach(n => {
                let temp = rowbg.repeat(colwidth - 2) + Utils.toFixedLength(n, 2, "c");
                head += temp;
            });
            for (let i = 0; i < this.data.length; i++) {
                const element = this.data[i];
                let temp = "";
                if (i % this.cols === 0) {
                    temp = Utils.toFixedLength(sequence[i / this.cols], 2, "r");
                    let newrow = "<br>";
                    head += newrow + temp + " |";
                }
                temp = Utils.toFixedLength(element, 2);
                temp = Utils.toFixedLength(temp, -colwidth, matbg);
                head += `${temp}`;
            }
            let s3 = head + tail;
            document.querySelector(this.id).innerHTML += s3;
        },
        save() {
            arg = { ...this };
        }
    };
    return result;
};
let Wizard = {
    add(base, extension, pos) {
    },
    predictDimensions(base, extension, pos) {
        let newpos = new PosBuilder();
        newpos.n = (5);
        console.log(">> pos:", base, newpos);
    },
    merge(Big, Small, origin) {
        let result = {
            ...Big
        };
        for (let bigRow = 0; bigRow < result.rows; bigRow++) {
            if (bigRow < Small.rows) {
                result.row.set(bigRow, Small.row.get(bigRow));
            }
        }
        return result;
    }
};
Matrix.prototype.js = {
    aPos: {},
    loc: {},
    main() {
        var z = [];
        let count = 5;
        for (let step = 1; step <= count; step++) {
            z[step] = new Matrix(step, step);
            z[step].print();
        }
        ;
        var somedata = [1, 2, 3, 4, 5];
        var a = ["A", "B", "C", "D", "E"];
        var aPos = new PosBuilder().setMatrix(z[5]).setN(5).build();
        Wizard.predictDimensions(z[5], z[4], aPos);
    }
};
