declare var PBN: Map<String, number>;
declare let DIVMAP: Map<String, Object>;
declare let ALPHA: string[];
declare let COLS: number;
declare let ROWS: number;
declare var animationqueue: number;
declare function update_div_value(div: any): void;
declare function animateandqueueremoval(tile: any): void;
declare function defaultonclickfunction(event: any): void;
declare class HtmlPrinter {
    cleanuplist: [string];
    container_div: string;
    MAX: number;
    count: number;
    constructor();
    static divpool: Map<String, HTMLDivElement>;
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
declare function highlightRandom(): void;
declare function main(): void;
declare class Tool {
    speak(): void;
}
//# sourceMappingURL=main.d.ts.map