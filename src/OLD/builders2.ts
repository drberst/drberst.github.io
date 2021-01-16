import Matrix from './matrix.js';
import Utils from './utils.js';

// interface IPosBuilder {
//     rows?: number;
//     cols?: number;
//     n?: number;
//     x?: number;
//     y?: number;
//     matrix?: Matrix;
// }
export default class PosBuilder {
    rows: number;
    cols: number;
    n: number;
    x: number;
    y: number;
    cell: string;
    constructor(input?) {
        if(Utils.isDefined(input))  Object.assign(this,...input);
        this.rows = Matrix.default.rows;
        this.cols = Matrix.default.cols;
    }

    static from(input:Pos) {
        return {...input};
        // (Utils.isNull(input.rows)) ? this.rows = Matrix.default.rows : this.rows = input.rows;
        // (Utils.isNull(input.cols)) ? this.cols = Matrix.default.cols : this.cols = input.cols;
        // if (Utils.isNull(input.matrix)) {
        //     this.rows = input.matrix.rows;
        //     this.cols = input.matrix.cols;
        // }
        // if (Utils.isNull(input.n)) this.n = input.n;
        // if (Utils.isNull(input.x)) this.x = input.x;
        // if (Utils.isNull(input.y)) this.y = input.y;
    }
    setMatrix(M:Matrix) {
        this.rows = M.rows;
        this.cols = M.cols;
        return this;
    }
    setN(n:number) {
        this.n = n;
        return this;
    }
    setX(x:number) {
        this.x = x;
        return this;
    }
    setY(y:number) {
        this.y = y;
        return this;
    }
    setCell(cell:string) {
        this.cell = cell;
        return this;
    }
    setRows(rows:number) {
        this.rows = rows;
        return this;
    }
    setCols(cols:number) {
        this.cols = cols;
        return this;
    }

    build() {
        if (!('n' in this)) {
            throw new Error('n is missing')
        }
        if (Utils.isNull(this.x)) this.x = this.n % this.cols;
        if (Utils.isNull(this.y)) this.y = this.n / this.cols;
        if (Utils.isNull(this.n)) this.n = this.y * this.cols + this.x;
        return new Pos(this.rows, this.cols, this.n, this.x, this.y);
    }
}

// class pb {
//     // constructor(n) {
//     //     this.n = n;
//     // }
//     constructor(aMatrix) {
//         this.rows = aMatrix.rows;
//         this.cols = aMatrix.cols;
//     }
//     set(n) {
//         this.n = n;
//         return this;
//     }
//     setX(x) {
//         this.x = x;
//         return this;
//     }
//     setY(y) {
//         this.y = y;
//         return this;
//     }
//     setCell(cell) {
//         this.cell = cell;
//         return this;
//     }
//     setRows(rows) {
//         this.rows = rows;
//         return this;
//     }
//     setCols(cols) {
//         this.cols = cols;
//         return this;
//     }

//     build() {
//         // if (!('weight' in this)) {
//         //     throw new Error('Weight is missing')
//         // }
//         if (!('x' in this)) this.x = this.n % this.cols;
//         if (!('y' in this)) this.y = parseInt(this.n / this.cols);
//         return new matPos(this.rows, this.cols, this.n, this.x, this.y);
//     }
// }
class Pos {
    rows: number;
    cols: number;
    n: number;
    x: number;
    y: number;

    constructor(rows: number, cols: number, n: number, x: number, y: number) {
        this.rows = rows;
        this.cols = cols;
        this.n = n;
        this.x = x;
        this.y = y;
    }
    shiftX(amount: number) {
        this.n += amount;
        if (this.x > this.cols) {
            this.y++;
            this.x -= this.cols;
        }
    }
    moveY(amount: any) { }
    moveX(amount: number) {
        this.n += amount;
        let temp = new PosBuilder().setRows(this.rows).setCols(this.cols).setN(this.n);
        temp.n += this.y * this.cols + this.x;

        // if (x > cols) {
        //     y++;
        //     x -= cols;
        // }

        return temp.build();
    }
    // up(n) {}
}
declare var _PosBuilder: typeof PosBuilder;
var _PosBuilder = PosBuilder;