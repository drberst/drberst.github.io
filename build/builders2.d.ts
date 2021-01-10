import Matrix from './matrix.js';
export default class PosBuilder {
    rows: number;
    cols: number;
    n: number;
    x: number;
    y: number;
    cell: string;
    constructor(input?: any);
    static from(input: Pos): {
        rows: number;
        cols: number;
        n: number;
        x: number;
        y: number;
    };
    setMatrix(M: Matrix): this;
    setN(n: number): this;
    setX(x: number): this;
    setY(y: number): this;
    setCell(cell: string): this;
    setRows(rows: number): this;
    setCols(cols: number): this;
    build(): Pos;
}
declare class Pos {
    rows: number;
    cols: number;
    n: number;
    x: number;
    y: number;
    constructor(rows: number, cols: number, n: number, x: number, y: number);
    shiftX(amount: number): void;
    moveY(amount: any): void;
    moveX(amount: number): Pos;
}
export {};
//# sourceMappingURL=builders2.d.ts.map