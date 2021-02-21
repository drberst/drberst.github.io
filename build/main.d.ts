declare const GLOB: {
    HEIGHT: number;
    WIDTH: number;
    COUNT: number;
    TILEPX: number;
    container_div: string;
    LOWER: string;
    UPPER: string;
};
declare const MAPS: {
    id2cell: Map<any, any>;
    cell2val: Map<any, any>;
};
declare const FUN: {
    d: (n: any) => number;
};
declare const SPELLS: {
    CrazyTiles: (n?: number) => void;
    Increment: (cellname: any) => void;
};
declare let stages: {
    init: () => void;
    randomshit: () => void;
};
declare class Utils {
    static clearIntervals(): void;
    static update_div_value(div: any, val?: string): void;
    static num2Abc: (num: any) => any;
    static abc2Num: (abc: any) => number;
    static cell2XY: (cellname: any) => void;
    static xy2Cell: (x: any, y: any) => any;
    static n2Cell: (n: any) => any;
    static toFixedLength: (input: any, length: any, padding?: any) => any;
    static clean: (element: any) => void;
    static isNull(element: any): boolean;
    static isDefined(element: any): boolean;
    static ascii2CellList(options: any): any[];
}
declare class Loc {
    x: number;
    y: number;
    index: number;
    cellname: string;
    constructor(x?: number, y?: number);
    static fromCell(cellname: any): Loc;
    getCellname(): any;
    getIndex(): number;
}
declare class Nav {
    static directions: (id: number) => {
        above: number;
        below: number;
        left: number;
        right: number;
    };
    static zDivrections: (div: HTMLDivElement) => {
        above: number;
        below: number;
        left: number;
        right: number;
    };
}
declare function BuildGrid(): void;
declare function WriteNumber(): void;
//# sourceMappingURL=main.d.ts.map