import { Util } from "./Classes.js";
import SingleLayerComp from "./SingleLayerComp.js";

export default (function () {
    let WIDTH = 550;
    let HEIGHT = 550;
    const FFT_SIZE = 2 ** 13;
    const SPEED = { animation: 1 / 1 }
    const SMOOTHING = 0;

    let binsize = 1;
    let analyzer: AnalyserNode;
    let bufferLength;
    let PLAYING = true;
    let audioCtx;
    let window = {
        min: 0,
        max: 3000,
        size: function () { return this.max - this.min }
    }
    function stop() {
        PLAYING = false;
        if (audioCtx.state !== "closed")
            audioCtx.close();
    }
    // let ctx = {};
    function micVisualizer(aComp) {
        console.log("------------ Begin visualizer")
        const AllCanvas = document.querySelectorAll('canvas');
        // debugger;
        const canvas = AllCanvas[0];
        const ctx = AllCanvas[0].getContext('2d');
        const ctx2 = AllCanvas[1].getContext('2d');
        const ctx3 = AllCanvas[2].getContext('2d');
        for (let i = 0; i < AllCanvas.length; i++) {
            const element = AllCanvas[i];
            element.width = WIDTH;
            element.height = HEIGHT;
        }
        // canvas.width = WIDTH;
        // canvas.height = HEIGHT;
        // WIDTH = canvas.width;
        // HEIGHT = canvas.height;
        audioCtx = new AudioContext();
        // const audio = new Audio("C_major.mp3");
        // const audio = new Audio("./media/Battle vs Champion.mp3");
        // const audio = new Audio("audiocheck.net_sin_440Hz_-3dBFS_3s.wav");
        // audio.playbackRate = SPEED.animation;
        if (navigator.mediaDevices.getUserMedia) {
            console.log('getUserMedia supported.');
            var constraints = { audio: true }
            navigator.mediaDevices.getUserMedia(constraints)
                .then(
                    function (stream) {
                        const source = audioCtx.createMediaStreamSource(stream);
                        analyzer = audioCtx.createAnalyser();
                        analyzer.smoothingTimeConstant = SMOOTHING;
                        analyzer.fftSize = FFT_SIZE;
                        // analyzer.maxDecibels = -45;
                        // analyzer.minDecibels = -55;

                        source.connect(listen);
                        listen.connect(analyzer);
                        // source.connect(analyzer);
                        // analyzer.connect(audioCtx.destination);
                    })
                .catch(function (err) { console.log('The following gUM error occured: ' + err); })
        } else {
            console.log('getUserMedia not supported on your browser!');
        }
        // const source = audioCtx.createMediaElementSource(audio);
        // let t = 60;

        var listen = audioCtx.createGain();
        listen.gain.setValueAtTime(30, 0);

        // * analyzer
        analyzer = audioCtx.createAnalyser();
        analyzer.smoothingTimeConstant = SMOOTHING;
        analyzer.fftSize = FFT_SIZE;
        // analyzer.maxDecibels = -45;
        // analyzer.minDecibels = -55;

        // source.connect(listen);
        listen.connect(analyzer);
        // source.connect(analyzer);
        // analyzer.connect(audioCtx.destination);
        // analyzer.
        // audio.play();
        /**
         * Some simplifcation of terms:
         * FFT is the fast transform bin size, there will be 256 bins
         * SampleRate is the number of bins of audio data
         * so
         * Frequencies per bin is SampleRate / FFT
         * then halved again because the
         */
        bufferLength = analyzer.frequencyBinCount;
        binsize = (audioCtx.sampleRate / 2) / bufferLength;
        console.log("SampleRate:", audioCtx.sampleRate)
        console.log("Single channel:", audioCtx.sampleRate / 2)
        console.log("FFT", analyzer.fftSize);
        console.log("bufferlength", bufferLength);
        console.log("hz per bin", (audioCtx.sampleRate / 2) / bufferLength);
        const timeData = new Float32Array(bufferLength);
        const frequencyData = new Uint8Array(bufferLength);



        PLAYING = true;
        // let timeElapsed = 0;
        // let cancel = setInterval(() => {
        //     timeElapsed += 1000;
        //     console.log("time", timeElapsed)
        //     if (timeElapsed >= t * 1000) {
        //         PLAYING = false;
        //         clearInterval(cancel);
        //     }
        //     // debugger;
        // }, 1000);
        drawTimeData(timeData, ctx2);
        // ctx3.rotate(180)
        drawWaterfall(frequencyData, ctx);
        // drawFrequency(frequencyData, ctx);
        // octavesCompose(aComp, frequencyData);

        drawCompo(aComp, frequencyData);
    }


    function mp3Visualizer(aComp) {
        console.log("------------ Begin visualizer")
        const AllCanvas = document.querySelectorAll('canvas');
        // debugger;
        const canvas = AllCanvas[0];
        const ctx = AllCanvas[0].getContext('2d');
        const ctx2 = AllCanvas[1].getContext('2d');
        const ctx3 = AllCanvas[2].getContext('2d');
        for (let i = 0; i < AllCanvas.length; i++) {
            const element = AllCanvas[i];
            element.width = WIDTH;
            element.height = HEIGHT;
        }
        audioCtx = new AudioContext();
        const audio = new Audio("./media/Battle vs Gym Leader.mp3");
        const source = audioCtx.createMediaElementSource(audio);
        let t = 3;

        var listen = audioCtx.createGain();
        // listen.gain.setValueAtTime(50, 0);

        // * analyzer
        analyzer = audioCtx.createAnalyser();
        analyzer.smoothingTimeConstant = SMOOTHING;
        analyzer.fftSize = FFT_SIZE;

        source.connect(listen);
        listen.connect(analyzer);
        analyzer.connect(audioCtx.destination);
        audio.play();
        /**
         * Some simplifcation of terms:
         * FFT is the fast transform bin size, there will be 256 bins
         * SampleRate is the number of bins of audio data
         * so
         * Frequencies per bin is SampleRate / FFT
         * then halved again because the
         */
        bufferLength = analyzer.frequencyBinCount;
        binsize = (audioCtx.sampleRate / 2) / bufferLength;
        console.log("SampleRate:", audioCtx.sampleRate)
        console.log("Single channel:", audioCtx.sampleRate / 2)
        console.log("FFT", analyzer.fftSize);
        console.log("bufferlength", bufferLength);
        console.log("hz per bin", (audioCtx.sampleRate / 2) / bufferLength);
        const timeData = new Float32Array(bufferLength);
        const frequencyData = new Uint8Array(bufferLength);



        PLAYING = true;
        // let timeElapsed = 0;
        // let cancel = setInterval(() => {
        //     timeElapsed += 1000;
        //     console.log("time", timeElapsed)
        //     if (timeElapsed >= t * 1000) {
        //         PLAYING = false;
        //         audioCtx.close();
        //         clearInterval(cancel);
        //     }
        //     // debugger;
        // }, 1000);
        drawTimeData(timeData, ctx2);
        // ctx3.rotate(180)
        drawWaterfall(frequencyData, ctx);
        // drawFrequency(frequencyData, ctx);
        // octavesCompose(aComp, frequencyData);
        // let intervals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        // let scaleArray = ScaleInHz(27.5, 11 * 8, intervals);
        // console.log(scaleArray);
        drawCompo(aComp, frequencyData);
    }
    function ScaleInHz(start, n, intervals?) {
        let majorscaletones = [0, 2, 4, 5, 7, 9, 11]
        // console.log(intervals);
        // debugger;
        if (typeof intervals == 'undefined') intervals = majorscaletones;
        let t = 0;
        let result = [];
        for (let i = 0; i < n; i++) {
            let val = start * 2 ** (i / 12);
            if (intervals.indexOf(i % 12) != -1) {
                result[i] = val;
                // result.push(val);
                // setTimeout(() => {
                //     Util.arraySummary(frequencyData);
                // }, 1000 * i);
            }
        }
        // console.log("Generated scale:", result);
        return result;
    }


    function visualizer(aComp) {
        const AllCanvas = document.querySelectorAll('canvas');
        // debugger;
        const canvas = document.querySelector('canvas');
        const ctx = AllCanvas[0].getContext('2d');
        const ctx2 = AllCanvas[1].getContext('2d');

        WIDTH = canvas.width;
        HEIGHT = canvas.height;
        console.log("------------ Begin visualizer")
        const audioCtx = new AudioContext();
        // const audio = new Audio("C_major.mp3");
        // audio.playbackRate = SPEED.playback;
        // const source = audioCtx.createMediaElementSource(audio);

        // * createOscillator
        const Synth = audioCtx.createOscillator();
        Synth.type = "sine";
        // source.frequency.value = 440;
        // source.frequency.setValueAtTime(10000, audioCtx.currentTime + 4);
        // source.frequency.setValueAtTime(20000, audioCtx.currentTime + 8);
        let n = 24;
        // Synth.connect(audioCtx.destination);
        Synth.start();
        let majorscaletones = [0, 2, 3, 5, 7, 10, 12]
        let t = 0;
        for (let i = 0; i <= n; i++) {
            let val = 100 * 2 ** (i / 12);
            if (majorscaletones.indexOf(i % 12) != -1) {

                Synth.frequency.setValueAtTime(val, audioCtx.currentTime + t);
                t += 1 / 4;
                // setTimeout(() => {
                console.log("Time:", i, "freq:", val);
                //     Util.arraySummary(frequencyData);
                // }, 1000 * i);
            }
        }
        ScaleInHz(440, 12);


        // source.frequency.setValueAtTime(100 * Math.pow(2, 24 / 12), audioCtx.currentTime + 2);
        Synth.stop(audioCtx.currentTime + t * 1.1);
        setTimeout(() => {
            PLAYING = false;
            // debugger;
        }, t * 1000 - 5);
        Synth.connect(audioCtx.destination);

        // * analyzer
        analyzer = audioCtx.createAnalyser();
        analyzer.smoothingTimeConstant = SMOOTHING;
        analyzer.fftSize = FFT_SIZE;
        // analyzer.maxDecibels = -45;
        // analyzer.minDecibels = -50;
        Synth.connect(analyzer);
        // audio.play();
        /**
         * Some simplifcation of terms:
         * FFT is the fast transform bin size, there will be 256 bins
         * SampleRate is the number of bins of audio data
         * so
         * Frequencies per bin is SampleRate / FFT
         * then halved again because the
         */
        bufferLength = analyzer.frequencyBinCount;
        binsize = (audioCtx.sampleRate / 2) / bufferLength;
        console.log("SampleRate:", audioCtx.sampleRate)
        console.log("Single channel:", audioCtx.sampleRate / 2)
        console.log("FFT", analyzer.fftSize);
        console.log("bufferlength", bufferLength);
        console.log("hz per bin", (audioCtx.sampleRate / 2) / bufferLength);
        const timeData = new Float32Array(bufferLength); //
        const frequencyData = new Uint8Array(bufferLength); // 128 bins with a value corresponding to the frequency at the current moment

        PLAYING = true;
        drawTimeData(timeData, ctx);
        // drawFrequency(frequencyData, ctx);
        drawWaterfall(frequencyData, ctx2);
        // octavesCompose(aComp, frequencyData);

    }

    function drawCompo(aComp, frequencyData) {
        analyzer.getByteFrequencyData(frequencyData);
        let intervals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

        let scaleArray = ScaleInHz(27.5, 11 * 8, intervals);

        let result = getPitch(frequencyData);
        // let element: pitchobj;
        for (let index = 0; index < result.length; index++) {
            const element = result[index];

            let key = index;
            key = Util.n2Cell(key, aComp.grid);
            let [x, y] = Util.n2Xy(index, aComp.grid);
            // let oldval = aComp.get(key);
            let newVal = element;
            let noteNames = ["A", "B♭", "B", "C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "G♯"]

            aComp.setProp(key, "title", noteNames[x] + y + "=" + scaleArray[index].toFixed(2) + "hz");

            if (!aComp.options.max || newVal > aComp.options.max) {
                aComp.options.max = newVal;
            }
            aComp.set(key, element);
        }
        let drawfun = function () {
            setTimeout(() => {
                aComp.refresh();
                drawCompo(aComp, frequencyData);
                // if (aComp.bg.averageValue() > 0) console.log("peakval:", peakval, "cell:", iPeakval, "/", iComp, "APM:", aComp.bg.averageValue())
            }, getSpeed());
        }
        if (PLAYING)
            requestAnimationFrame(drawfun);
        // requestAnimationFrame(() => {
        //     setTimeout(() => drawTimeData(timeData), getSpeed());
        // });
    }
    interface pitchobj { V: number, f: number, bfhz: string, hz: number, tone: number, n: number }
    function getPitch(frequencyData) {
        let intervals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

        let noteNames = ["A", "B♭", "B", "C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "G♯"]
        let result = [];
        let scaleArray = ScaleInHz(27.5, 11 * 8, intervals);
        // let result =
        let allVals = [];
        let peaks = [];
        let bfhz = "";
        let bestfactor = 1;

        for (let i = 0; i < scaleArray.length; i++) {
            const tonehz = scaleArray[i];
            let temp = tonehz / binsize;
            let octave = 0;
            // console.log("checking for octaves of ", tonehz, "aka", noteNames[i])
            // while (temp < frequencyData.length) {
            let amount = frequencyData[Math.floor(temp)];
            // console.log("for", noteNames[i], "checking f", temp * binsize, "in bin", temp, "of", frequencyData.length);
            if (!result[i]) result[i] = 0;
            let f = (amount / 255) ** 5
            if (f > .25)
                result[i] = Util.round(f, 1);

            // if (!result[i]) result[i] = 0;
            // if (!result[octave * scaleArray.length + i]) result[octave * scaleArray.length + i] = 0;
            // result[octave * scaleArray.length + i] += amount ** 3;
            // let f =
            // octave++;
            // temp *= 2;
            // }
        }


        // console.log("PEAKS", peaks);
        // console.log("RESULT", result);
        return result;
    }
    function getPitch2(frequencyData) {

        let intervals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

        let noteNames = ["A", "B♭", "B", "C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "G♯"]
        let result = [];
        let scaleArray = ScaleInHz(27.5, 11 * 8, intervals);
        // let result =

        let peaks = [];
        let bfhz = "";
        let bestfactor = 1;
        for (let i = 0; i < frequencyData.length; i++) {
            let obj: pitchobj = {
                V: 0,
                f: 0,
                bfhz: "",
                hz: 0,
                tone: 0,
                n: 0
            };
            const val = frequencyData[i];
            if (val > 128) {
                const hz = i * binsize;
                obj.V = val;
                let [min, max] = [.95, 1.05]
                bestfactor = 1;
                for (let j = 0; j < scaleArray.length; j++) {
                    // const note = noteNames[j];
                    const noteRoot = scaleArray[j]

                    let factor = hz / noteRoot;
                    // let octave = 1;
                    // while (factor > 1) {
                    //     factor = hz / (noteRoot * 2 ** octave++);
                    // }
                    // if (min < factor && factor < max)
                    // if (!result[Util.round(hz, 2)]) result[Util.round(hz, 2)] = [];
                    // result[Util.round(hz, 2)].push(Util.round(factor ** 3, 5));
                    if (Math.abs(factor - 1) < bestfactor) {
                        bestfactor = Math.abs(factor - 1)
                        bfhz = hz.toFixed(2) + "/" + noteRoot.toFixed(2);
                        obj.hz = Util.round(hz, 2);
                        obj.tone = Util.round(noteRoot, 2);
                        obj.n = j;
                    }
                    // if(
                }

                obj.f = 1 / bestfactor;
                obj.bfhz = bfhz;
                peaks.push(obj);
                // if (bestfactor < 1)
                // console.log("best factor", bestfactor, "at ", bfhz)
            }
        }


        let sortf = function (a, b) {
            // console.log("YES", a.f, b.f, a.f - b.f)
            return b.f - a.f;
        };
        // let compress = function(a,b)
        peaks.sort(sortf);
        // Get Peak of Peaks, lets say top 20%
        let numberToKeep = peaks.length / 5
        console.log("TOP 5:", peaks.slice(0, 5));
        // result = peaks.slice(0, Math.floor(numberToKeep));
        result = peaks;

        // peaks.forEach(element => {

        // });
        //

        // console.log("PEAKS", peaks);
        // console.log("RESULT", result);
        return result;
    }

    function octavesCompose(aComp: SingleLayerComp, frequencyData) {
        analyzer.getByteFrequencyData(frequencyData);

        let slize = frequencyData.slice(window.min / binsize, window.max / binsize);
        // console.log(slize);
        let intervals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

        let noteNames = ["A", "B♭", "B", "C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "G♯"]
        let scaleArray = ScaleInHz(27.5, 11 * 8, intervals);
        // let result = getPitch(frequencyData);
        // console.log(result);
        // debugger;

        for (let i = 0; i < slize.length; i++) {
            const hz = i * binsize;
            const amount = slize[i];
            let j = 0;

            for (j = 0; j < scaleArray.length; j++) {
                // let cellnumber = Math.floor(i / slize.length * aComp.size());
                let cellnumber = j;
                let cell = Util.n2Cell(cellnumber, aComp.grid);
                let key = 0;
                const scaleHz = scaleArray[j];
                let dif = hz - scaleHz;
                if (Math.abs(dif) < binsize && amount > 128) {
                    // That corresponds to a hz (i*binsize)
                    // Which aligns with a scale degree (j)
                    // Which should put an amount into a cell (j)
                    let val = Number(aComp.get(cell));
                    let float = (amount) ** 3;
                    let newval = val + float;
                    // let log2 = Math.log2(val + 1);
                    aComp.set(cell, val + float);
                    if (!aComp.options.max || newval > aComp.options.max) {
                        aComp.options.max = newval;
                    }
                    // Util.out("new max is " + aComp.options.max);
                    let [x, y] = Util.n2Xy(j, aComp.grid);
                    // let [x, y] = Util.cell2Xy(cellname, aGrid);

                    aComp.setProp(cell, "title", noteNames[x] + ":" + y + "=" + scaleHz.toFixed(2) + "hz");
                    // console.log(i, "in i got as far as j", j);
                    // break;
                }
                // if (amount > 200) debugger;
                // let key = Util.n2Cell(i, aComp.bg);

                // Key is hz
                // if (amount > 200 || amount < 120)
                // if (key && amount > 220)
                // aComp.set(key, amount);
                // debugger;
            }

            // if (cell)
            // aComp.set(cell, key);
            // let cellnumber = j;
            // let cell = Util.n2Cell(cellnumber, aComp.grid);
            // let val = aComp.get(cell);
            // aComp.set(cell, val / 2)
        }

        let drawfun = function () {
            setTimeout(() => {
                aComp.refresh();
                octavesCompose(aComp, frequencyData);
                // if (aComp.bg.averageValue() > 0) console.log("peakval:", peakval, "cell:", iPeakval, "/", iComp, "APM:", aComp.bg.averageValue())
            }, getSpeed());
        }
        if (PLAYING)
            requestAnimationFrame(drawfun);
    }
    function octavesCompose2(aComp: SingleLayerComp, frequencyData) {
        analyzer.getByteFrequencyData(frequencyData);

        let slize = frequencyData.slice(window.min / binsize, window.max / binsize);
        // console.log(slize);
        let intervals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        let scaleArray = ScaleInHz(27.5, 11 * 8, intervals);
        console.log(scaleArray);
        debugger;
        for (let i = 0; i < slize.length; i++) {

            // const iBin = Math.floor(i / aComp.size() * slize.length);

            const hz = i * binsize;
            const amount = slize[i];
            let key = 0;
            let vals = [];
            for (let j = 0; j < scaleArray.length; j++) {
                const element = scaleArray[j];
                let dif = hz - element;
                if (Math.abs(dif) < binsize * 1) {
                    // console.log("close", hz, "vs", element, "dif=", dif);
                    key = element;
                    // console.log("So we can assume this is", hz, "hz which is interval", j)
                    let x = Math.floor(j % intervals.length);
                    let y = Math.floor(j / intervals.length);
                    // console.log("x", x, "y", y);
                    key = Util.xy2Cell(x, y);
                    // key = Util.n2Cell(j, aComp.bg);
                    vals = [j, x, y]
                    break;
                }
            }
            // if (amount > 200) debugger;
            // let key = Util.n2Cell(i, aComp.bg);

            // Key is hz
            // if (amount > 200 || amount < 120)
            // if (key && amount > 220)
            // aComp.set(key, amount);
            if (key)
                aComp.set(key, hz);
            // debugger;

        }

        let drawfun = function () {
            setTimeout(() => {
                aComp.refresh();
                octavesCompose(aComp, frequencyData);
                // if (aComp.bg.averageValue() > 0) console.log("peakval:", peakval, "cell:", iPeakval, "/", iComp, "APM:", aComp.bg.averageValue())
            }, getSpeed());
        }
        if (PLAYING)
            requestAnimationFrame(drawfun);
    }

    function drawTimeData(timeData, ctx) {
        // inject the time data into the time data array
        analyzer.getFloatTimeDomainData(timeData);
        // now that we have the data, let's turn it into something visual
        // 1. clear the canvas
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        // 2. set up some canvas drawing
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#ffc600';
        ctx.beginPath();
        const sliceWidth = WIDTH * 1.0 / bufferLength;
        let x = 0;
        // Util.arraySummary(timeData);
        timeData.forEach((data, i) => {
            // if (i % 10 == 0) {
            // if (data != 128) debugger;
            // multiplier in drawing the data
            const v = data;
            // height of visualized data
            const y = (v + 1) / 2 * HEIGHT;
            // draw our lines
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            // }
            x += sliceWidth;
        });
        ctx.stroke();


        // call itself as soon as possible!
        if (PLAYING)
            requestAnimationFrame(() => {
                setTimeout(() => drawTimeData(timeData, ctx), getSpeed());
            });
    }

    function drawWaterfall(frequencyData, ctx) {
        // get the frequency data into our frequencyData array
        analyzer.getByteFrequencyData(frequencyData);


        // ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.clearRect(0, HEIGHT / 2, WIDTH, HEIGHT);
        // ctx.rotate(Math.PI / 2);


        // figure out the bar width
        // const barWidth = 640.0 / bufferLength;
        // let x = 0;
        let peak = 0;
        let ipeak = 0;
        let xpeak = 0;
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, HEIGHT / 2, WIDTH, HEIGHT);

        let barWidth = WIDTH / (window.max - window.min) * binsize;
        let barHeight;
        let x = 0;

        // let xvalues = [];
        // let skippedbins = 0;
        let i = 0;


        for (i = 0; i < bufferLength; i++) {
            // console.log("we're not here for values like", i);
            // continue;
            // if (true) {
            const hz = i * binsize;
            if (hz > window.min && hz < window.max) {
                let percentHeight = frequencyData[i] / 255;
                barHeight = percentHeight * (HEIGHT / 2);

                const [h, s, l] = [percentHeight, 0.8, percentHeight];

                // if (frequencyData[i] > 200) debugger;
                const [r, g, b] = Util.audio.hslToRgb(h, s, l);
                // ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                ctx.fillStyle = `hsl(${h * 360 + 100}, ${s * 100}%, ${l * 50}%)`;

                // if (i % 5 == 0)
                ctx.fillRect(x, HEIGHT - barHeight, barWidth, 50);

                ctx.fillRect(x, HEIGHT / 2 - 3, barWidth, 2);


                // xvalues.push([x, HEIGHT - barHeight, barWidth - 2, barHeight]);
                if (barHeight > peak) {
                    peak = barHeight;
                    xpeak = x;
                    ipeak = i;
                }
                x += barWidth;
            }
        }
        // ctx.beginPath();
        // ctx.moveTo(0, HEIGHT / 2);
        // ctx.lineTo(WIDTH, HEIGHT / 2);
        // ctx.stroke();

        // ctx.strokeStyle = "white";
        // ctx.font = '10px monospace';
        // ctx.strokeText(`${ipeak}(${Math.round(ipeak * binsize)}hz),${peak}`, xpeak, HEIGHT / 2 - 10);
        // console.log("x", x, "counts", x / barWidth, "shouldequal", skippedbins);
        // console.log(xvalues);
        // prevFrequency = [...frequencyData];
        // ctx.putImageData(imgData, 0, 1);
        let imgData = ctx.getImageData(0, 0, WIDTH, HEIGHT / 2);
        // setTimeout(() => {
        // for (let i = 10; i < HEIGHT; i += 10) {
        ctx.putImageData(imgData, 0, -1);

        // }
        // }, 50)
        if (PLAYING)
            requestAnimationFrame(() => { drawWaterfall(frequencyData, ctx) });
    }

    function drawFrequency(frequencyData, ctx) {
        // get the frequency data into our frequencyData array
        analyzer.getByteFrequencyData(frequencyData);
        // ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        // figure out the bar width
        // const barWidth = 640.0 / bufferLength;
        // let x = 0;
        let peak = 0;
        let ipeak = 0;
        let xpeak = 0;
        // ctx.fillStyle = 'rgb(0, 0, 0)';
        // ctx.fillRect(0, 0, WIDTH, HEIGHT);

        let barWidth = WIDTH / (window.max - window.min) * binsize;
        let barHeight;
        let x = 0;

        // let xvalues = [];
        // let skippedbins = 0;
        let i = 0;
        for (i = 0; i < bufferLength; i++) {
            // console.log("we're not here for values like", i);
            // continue;
            // if (true) {
            const hz = i * binsize;
            if (hz > window.min && hz < window.max) {
                barHeight = frequencyData[i] / 255 * HEIGHT * .9;
                const [h, s, l] = [frequencyData[i] / 255, 0.8, 0.5];

                // if (frequencyData[i] > 200) debugger;
                const [r, g, b] = Util.audio.hslToRgb(h, s, l);
                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

                ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
                // xvalues.push([x, HEIGHT - barHeight, barWidth - 2, barHeight]);
                if (barHeight > peak) {
                    peak = barHeight;
                    xpeak = x;
                    ipeak = i;
                }
                x += barWidth;
            }
        }

        ctx.strokeStyle = "white";
        ctx.font = '1em monospace';
        ctx.strokeText(`${ipeak}(${Math.round(ipeak * binsize)}hz)`, xpeak, 16);
        // console.log("x", x, "counts", x / barWidth, "shouldequal", skippedbins);
        // console.log(xvalues);

        if (PLAYING)
            requestAnimationFrame(() => { drawFrequency(frequencyData, ctx) });
    }

    function getSpeed() { return (1000 / 60) / SPEED.animation };

    return { visualizer, mp3Visualizer, micVisualizer, stop };
})();