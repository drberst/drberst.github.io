declare let GLOBALS: {
    ROWS: number;
    COLS: number;
    TILEPX: number;
    container_div: string;
};
declare let stages: {
    init: () => void;
    randomshit: () => void;
};
declare class Utils {
    static clearIntervals(): void;
    static update_div_value(div: any, val?: any): void;
    static numToAbc: (num: any) => string;
    static xy2Cell: (x: any, y: any) => string;
    static n2Cell: (n: any) => string;
    static toFixedLength: (input: any, length: any, padding?: any) => any;
    static clean: (element: any) => void;
    static isNull(element: any): boolean;
    static isDefined(element: any): boolean;
    static ascii2CellList(): any[];
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