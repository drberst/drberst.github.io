
export default class Utils {
    static numToAbc = function (num) {
        const alphabet = "abcdefghijklmnopqrstuvqxyz";
        const len = alphabet.length;

        if (num < len || num < 0) return alphabet.charAt(num);
        let tens = Math.floor(num / len);
        let result = alphabet.charAt(tens - 1) + Utils.numToAbc(num % len);
        return result;
    }

    static xy2Cell = function (x, y) {
        return Utils.numToAbc(x).toUpperCase()+y;
    }

    static toFixedLength = function(input, length, padding?) {
        padding = padding || "0";

        if (length <= 0) {
            let b = -1*length;
            return (input + padding.repeat(b-input.length).slice(-b));
        }
        return (padding.repeat(length) + input).slice(-length);
    }

    static clean = function(element) {
        element.classList.remove('tileHighlight');
        element.style = "huh";
        // console.log("done cleaning",element);
    }

    static isNull(element) {
        return element === undefined;
    }
    static isDefined(element) {
        return !Utils.isNull(element);
    }
}
var _utils = Utils;