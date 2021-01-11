declare let PBN: Map<String, Number>;
declare let DIVMAP: Map<String, Object>;
declare let ALPHA: string[];
declare let COLS: number;
declare let ROWS: number;
declare class printer {
    container_div: string;
    MAX: number;
    count: number;
    constructor();
    init(): void;
    framelen(n?: number): number;
}
declare class Utils {
    static numToAbc: (num: any) => any;
    static xy2Cell: (x: any, y: any) => any;
    static toFixedLength: (input: any, length: any, padding?: any) => any;
    static clean: (element: any) => void;
    static isNull(element: any): boolean;
    static isDefined(element: any): boolean;
}
declare let mainprinter: printer;
//# sourceMappingURL=main.d.ts.map