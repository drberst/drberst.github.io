declare class Utils {
    static update_div_value(div: Element, val?: string): void;
    static num2Abc: (num: any) => any;
    static abc2Num: (abc: any) => number;
    static cell2XY: (cellname: any) => void;
    static xy2Cell: (x: any, y: any) => any;
    static n2Cell: (n: any) => any;
    static toFixedLength: (input: any, length: any, padding?: any) => any;
    static clean: (element: any) => void;
    static isNull(element: any): boolean;
    static isDefined(element: any): boolean;
    static ascii2CellList(iStart?: Loc, iAscii?: string[]): any[];
    static cyclemanager(func: any, hz: any, count: any): void;
}
export { Utils };
import { Loc } from "./Classes.js";
//# sourceMappingURL=main.d.ts.map