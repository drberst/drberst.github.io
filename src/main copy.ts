
{
    // Maps and data structures
    var PBN = new Map<String, number>();
    let DIVMAP = new Map<String, Object>();
    let ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("");
    let COLS = 8;
    let ROWS = 8;

    var animationqueue = 0;

    for (let i = 0; i < COLS; i++) {
        for (let ii = 0; ii < ROWS; ii++) {
            //cell names start at first letter, but not the 0th number
            const element = ALPHA[i] + (ii + 1);
            PBN.set(element, ii);
        }
    }
    console.log("test", globalThis.g);

    function update_div_value(div) {
        // debugger;
        const cellname = div.title;
        let value: number = PBN.get(cellname); if (value === undefined) value = -1;
        div.innerHTML = String(value);
        div.className = "tile level" + value;
        div.style.boxShadow = `inset 0px ${-value}px ${value + 2}px  #DDD`;
        animateandqueueremoval(div);
    }

    function animateandqueueremoval(tile) {
        // console.log(animationqueue, tile);
        tile.classList.remove("tileHighlight");
        setTimeout(function () {
            tile.classList.add("tileHighlight");
            animationqueue--;
        }, 1 + 5 * animationqueue++);
    }

    function defaultonclickfunction(event) {
        let cell = event.currentTarget.title;
        let val = PBN.get(cell);
        let delta = 1;
        if (event.type === "wheel") {
            event.preventDefault();

            if (event.deltaY > 0) delta *= -1;
        }

        PBN.set(cell, val + delta);
        update_div_value(event.currentTarget);
    }

    // Printer
    class HtmlPrinter {
        cleanuplist: [string];
        container_div: string = "#grid_container";
        MAX: number;
        count: number;
        constructor() { };
        static divpool: Map<String, HTMLDivElement>;




        init() {
            let index = 0;
            let aPage = document.querySelector(this.container_div);
            this.MAX = ROWS * COLS;
            this.count = 0;
            HtmlPrinter.divpool = new Map();

            for (let rows = 0; rows < ROWS; rows++) {
                for (let cols = 0; cols < COLS; cols++) {
                    let cellname = Utils.xy2Cell(cols, rows + 1);
                    let div = document.createElement('div');
                    div.id = String(index);
                    div.title = cellname;
                    div.tabIndex = 0;

                    div.onclick = defaultonclickfunction;
                    div.onwheel = defaultonclickfunction;
                    update_div_value(div);

                    setTimeout(function () {
                        aPage.append(div)
                        // div.classList.remove("tileHighlight");
                    }, this.framelen(1000) * index)

                    HtmlPrinter.divpool.set(cellname, div);
                    index++;
                    this.count++;
                }
            }
        }
        framelen(n = 1000) {
            return n / this.MAX;
        }
    };


    // - - - Workers





    // - - - - UTILS
    class Utils {
        static numToAbc = function (num) {
            const alphabet = "abcdefghijklmnopqrstuvqxyz";
            const len = alphabet.length;

            if (num < len || num < 0) return alphabet.charAt(num);
            let tens = Math.floor(num / len);
            let result = alphabet.charAt(tens - 1) + Utils.numToAbc(num % len);
            return result;
        }

        static xy2Cell = function (x, y) {
            return Utils.numToAbc(x).toUpperCase() + y;
        }

        static toFixedLength = function (input, length, padding?) {
            padding = padding || "0";

            if (length <= 0) {
                let b = -1 * length;
                return (input + padding.repeat(b - input.length).slice(-b));
            }
            return (padding.repeat(length) + input).slice(-length);
        }

        static clean = function (element) {
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
    function highlightRandom() {
        let n = ROWS * COLS - 1;
        for (let i = 0; i < 5; i++) {
            let id: string = `${Math.floor(Math.random() * n)}`;
            let tile = document.getElementById(id);
            // console.log("BUTTON ACTIVATION", .currentTarget=", tile);
            // let aMatrix = new Matrix(3, 3, aTile.id);
            // aTile.value = aMatrix;
            // tile.innerHTML = `[${id}]`;
            tile.click();
            animateandqueueremoval(tile);
            // controller.queue_update(aTile);
        }

    }

    function main() {
        let pxsize = 24;
        document.documentElement.style.setProperty('--tileSize', pxsize + 'px');
        document.documentElement.style.setProperty('--totalWidth', COLS * (pxsize + 2) + 'px');
        let mainprinter = new HtmlPrinter();
        mainprinter.init();
        document.getElementById("clickMe").onclick = highlightRandom;

        let tt = new Tool();
        globalThis.g = { PBN, DIVMAP, COLS, ROWS, HtmlPrinter, Tool, tt };
        console.log("Done setting up:", globalThis.g);
    }


    /**
     * I think what I want to make is some kind of state machine
     * I want things to be in one state -> react to an input -> propagate the consequences ->
     * Now we have a new state -> show the new state -> show the transition somehow? Animation?
     *
     * So, how does that guide my code design?
     * Well, I want my code to be simple to understand, so I want to focus just a few pieces, with a few connections, and few moving parts.
     * Well, what do all of those words mean?
     *  Pieces = files / classes / objects
     *  Connections = objects that need to push/pull data from another object
     *  Moving parts = Anything that changes state, and anything that can break during its execution.
     *
     * I like that vocabulary, so let's proceed;
     * Pieces:
     *  Tools    = Primatives/structs, essentially static functions, no internal state  = [strings,numbers,arrays,maps] custom = [State,HTMLprinter,]
     *  Workers  = Objects, may have data on what they're doing/have done/will do = [MapManager,StateManager]
     *  Managers = Holds map of workers, tells those workers what to do, passes them input and collects their output
     *  Leaders  = Interact with humans, take a concept and translate it into requests for the managers
     *
     * Hmm, I like this model, but again I feel like I'm getting out of scope. Trying to do too much at once. But I'll leave these notes here
     *
     *
     *
     *
     * ****
     *  Another way to think of it would be as models
     *  like, if I'm making a new square from scratch, what are all the variables that are involved
     * and then I could seperate them into [workers/tools] after.
     *
     */
    class Tool {
        speak() {
            console.log("I have spoken");
        }
    }


    main();
}