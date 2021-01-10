interface Matrix_default {
    cols: number;
    rows: number;
    id: string;
}
interface IMatrix {
    rows: number;
    cols: number;
    data: number[];
    container: string;
    js: {
        aPos: object;
        loc: object;
        main: object;
    };
}
export default class Matrix implements IMatrix {
    rows: number;
    cols: number;
    data: number[];
    container: string;
    str: string;
    static default: Matrix_default;
    js: {
        aPos: {};
        loc: {};
        main: {};
    };
    constructor(rows: any, cols: any, container?: any, data?: any);
    static from(input: Matrix): {
        rows: number;
        cols: number;
        data: number[];
        container: string;
        str: string;
        js: {
            aPos: {};
            loc: {};
            main: {};
        };
    };
    get(n: any): number;
    set(n: any, value: any): void;
    getXY(x: any, y: any): number;
    setXY(x: any, y: any, value: any): void;
    toString(): string;
}
export {};
//# sourceMappingURL=matrix.d.ts.map