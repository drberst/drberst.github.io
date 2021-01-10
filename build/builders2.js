import Matrix from './matrix.js';
import Utils from './utils.js';
export default class PosBuilder {
    constructor(input) {
        if (Utils.isDefined(input))
            Object.assign(this, ...input);
        this.rows = Matrix.default.rows;
        this.cols = Matrix.default.cols;
    }
    static from(input) {
        return { ...input };
    }
    setMatrix(M) {
        this.rows = M.rows;
        this.cols = M.cols;
        return this;
    }
    setN(n) {
        this.n = n;
        return this;
    }
    setX(x) {
        this.x = x;
        return this;
    }
    setY(y) {
        this.y = y;
        return this;
    }
    setCell(cell) {
        this.cell = cell;
        return this;
    }
    setRows(rows) {
        this.rows = rows;
        return this;
    }
    setCols(cols) {
        this.cols = cols;
        return this;
    }
    build() {
        if (!('n' in this)) {
            throw new Error('n is missing');
        }
        if (Utils.isNull(this.x))
            this.x = this.n % this.cols;
        if (Utils.isNull(this.y))
            this.y = this.n / this.cols;
        if (Utils.isNull(this.n))
            this.n = this.y * this.cols + this.x;
        return new Pos(this.rows, this.cols, this.n, this.x, this.y);
    }
}
class Pos {
    constructor(rows, cols, n, x, y) {
        this.rows = rows;
        this.cols = cols;
        this.n = n;
        this.x = x;
        this.y = y;
    }
    shiftX(amount) {
        this.n += amount;
        if (this.x > this.cols) {
            this.y++;
            this.x -= this.cols;
        }
    }
    moveY(amount) { }
    moveX(amount) {
        this.n += amount;
        let temp = new PosBuilder().setRows(this.rows).setCols(this.cols).setN(this.n);
        temp.n += this.y * this.cols + this.x;
        return temp.build();
    }
}
var _PosBuilder = PosBuilder;
