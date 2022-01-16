import { Util } from "./Classes.js";
export default (function () {
    let WIDTH = 550;
    let HEIGHT = 550;
    const FFT_SIZE = Math.pow(2, 13);
    const SPEED = { animation: 1 / 1 };
    const SMOOTHING = 0;
    let binsize = 1;
    let analyzer;
    let bufferLength;
    let PLAYING = true;
    let window = {
        min: 0,
        max: 3000,
        size: function () { return this.max - this.min; }
    };
    function micVisualizer(aComp) {
        console.log("------------ Begin visualizer");
        const AllCanvas = document.querySelectorAll('canvas');
        const canvas = AllCanvas[0];
        const ctx = AllCanvas[0].getContext('2d');
        const ctx2 = AllCanvas[1].getContext('2d');
        const ctx3 = AllCanvas[2].getContext('2d');
        for (let i = 0; i < AllCanvas.length; i++) {
            const element = AllCanvas[i];
            element.width = WIDTH;
            element.height = HEIGHT;
        }
        const audioCtx = new AudioContext();
        if (navigator.mediaDevices.getUserMedia) {
            console.log('getUserMedia supported.');
            var constraints = { audio: true };
            navigator.mediaDevices.getUserMedia(constraints)
                .then(function (stream) {
                const source = audioCtx.createMediaStreamSource(stream);
                analyzer = audioCtx.createAnalyser();
                analyzer.smoothingTimeConstant = SMOOTHING;
                analyzer.fftSize = FFT_SIZE;
                source.connect(listen);
                listen.connect(analyzer);
            })
                .catch(function (err) { console.log('The following gUM error occured: ' + err); });
        }
        else {
            console.log('getUserMedia not supported on your browser!');
        }
        var listen = audioCtx.createGain();
        listen.gain.setValueAtTime(30, 0);
        analyzer = audioCtx.createAnalyser();
        analyzer.smoothingTimeConstant = SMOOTHING;
        analyzer.fftSize = FFT_SIZE;
        listen.connect(analyzer);
        bufferLength = analyzer.frequencyBinCount;
        binsize = (audioCtx.sampleRate / 2) / bufferLength;
        console.log("SampleRate:", audioCtx.sampleRate);
        console.log("Single channel:", audioCtx.sampleRate / 2);
        console.log("FFT", analyzer.fftSize);
        console.log("bufferlength", bufferLength);
        console.log("hz per bin", (audioCtx.sampleRate / 2) / bufferLength);
        const timeData = new Float32Array(bufferLength);
        const frequencyData = new Uint8Array(bufferLength);
        PLAYING = true;
        drawTimeData(timeData, ctx2);
        drawWaterfall(frequencyData, ctx);
        drawCompo(aComp, frequencyData);
    }
    function mp3Visualizer(aComp) {
        console.log("------------ Begin visualizer");
        const AllCanvas = document.querySelectorAll('canvas');
        const canvas = AllCanvas[0];
        const ctx = AllCanvas[0].getContext('2d');
        const ctx2 = AllCanvas[1].getContext('2d');
        const ctx3 = AllCanvas[2].getContext('2d');
        for (let i = 0; i < AllCanvas.length; i++) {
            const element = AllCanvas[i];
            element.width = WIDTH;
            element.height = HEIGHT;
        }
        const audioCtx = new AudioContext();
        const audio = new Audio("./media/Battle vs Gym Leader.mp3");
        const source = audioCtx.createMediaElementSource(audio);
        let t = 60;
        var listen = audioCtx.createGain();
        analyzer = audioCtx.createAnalyser();
        analyzer.smoothingTimeConstant = SMOOTHING;
        analyzer.fftSize = FFT_SIZE;
        source.connect(listen);
        listen.connect(analyzer);
        analyzer.connect(audioCtx.destination);
        audio.play();
        bufferLength = analyzer.frequencyBinCount;
        binsize = (audioCtx.sampleRate / 2) / bufferLength;
        console.log("SampleRate:", audioCtx.sampleRate);
        console.log("Single channel:", audioCtx.sampleRate / 2);
        console.log("FFT", analyzer.fftSize);
        console.log("bufferlength", bufferLength);
        console.log("hz per bin", (audioCtx.sampleRate / 2) / bufferLength);
        const timeData = new Float32Array(bufferLength);
        const frequencyData = new Uint8Array(bufferLength);
        PLAYING = true;
        drawTimeData(timeData, ctx2);
        drawWaterfall(frequencyData, ctx);
        drawCompo(aComp, frequencyData);
    }
    function ScaleInHz(start, n, intervals) {
        let majorscaletones = [0, 2, 4, 5, 7, 9, 11];
        if (typeof intervals == 'undefined')
            intervals = majorscaletones;
        let t = 0;
        let result = [];
        for (let i = 0; i < n; i++) {
            let val = start * Math.pow(2, (i / 12));
            if (intervals.indexOf(i % 12) != -1) {
                result[i] = val;
            }
        }
        return result;
    }
    function visualizer(aComp) {
        const AllCanvas = document.querySelectorAll('canvas');
        const canvas = document.querySelector('canvas');
        const ctx = AllCanvas[0].getContext('2d');
        const ctx2 = AllCanvas[1].getContext('2d');
        WIDTH = canvas.width;
        HEIGHT = canvas.height;
        console.log("------------ Begin visualizer");
        const audioCtx = new AudioContext();
        const Synth = audioCtx.createOscillator();
        Synth.type = "sine";
        let n = 24;
        Synth.start();
        let majorscaletones = [0, 2, 3, 5, 7, 10, 12];
        let t = 0;
        for (let i = 0; i <= n; i++) {
            let val = 100 * Math.pow(2, (i / 12));
            if (majorscaletones.indexOf(i % 12) != -1) {
                Synth.frequency.setValueAtTime(val, audioCtx.currentTime + t);
                t += 1 / 4;
                console.log("Time:", i, "freq:", val);
            }
        }
        ScaleInHz(440, 12);
        Synth.stop(audioCtx.currentTime + t * 1.1);
        setTimeout(() => {
            PLAYING = false;
        }, t * 1000 - 5);
        Synth.connect(audioCtx.destination);
        analyzer = audioCtx.createAnalyser();
        analyzer.smoothingTimeConstant = SMOOTHING;
        analyzer.fftSize = FFT_SIZE;
        Synth.connect(analyzer);
        bufferLength = analyzer.frequencyBinCount;
        binsize = (audioCtx.sampleRate / 2) / bufferLength;
        console.log("SampleRate:", audioCtx.sampleRate);
        console.log("Single channel:", audioCtx.sampleRate / 2);
        console.log("FFT", analyzer.fftSize);
        console.log("bufferlength", bufferLength);
        console.log("hz per bin", (audioCtx.sampleRate / 2) / bufferLength);
        const timeData = new Float32Array(bufferLength);
        const frequencyData = new Uint8Array(bufferLength);
        PLAYING = true;
        drawTimeData(timeData, ctx);
        drawWaterfall(frequencyData, ctx2);
    }
    function drawCompo(aComp, frequencyData) {
        analyzer.getByteFrequencyData(frequencyData);
        let intervals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        let scaleArray = ScaleInHz(27.5, 11 * 8, intervals);
        let result = getPitch(frequencyData);
        for (let index = 0; index < result.length; index++) {
            const element = result[index];
            let key = index;
            key = Util.n2Cell(key, aComp.grid);
            let [x, y] = Util.n2Xy(index, aComp.grid);
            let newVal = element;
            let noteNames = ["A", "B♭", "B", "C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "G♯"];
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
            }, getSpeed());
        };
        if (PLAYING)
            requestAnimationFrame(drawfun);
    }
    function getPitch(frequencyData) {
        let intervals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        let noteNames = ["A", "B♭", "B", "C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "G♯"];
        let result = [];
        let scaleArray = ScaleInHz(27.5, 11 * 8, intervals);
        let allVals = [];
        let peaks = [];
        let bfhz = "";
        let bestfactor = 1;
        for (let i = 0; i < scaleArray.length; i++) {
            const tonehz = scaleArray[i];
            let temp = tonehz / binsize;
            let octave = 0;
            let amount = frequencyData[Math.floor(temp)];
            if (!result[i])
                result[i] = 0;
            let f = Math.pow((amount / 255), 5);
            if (f > .25)
                result[i] = Util.round(f, 1);
        }
        return result;
    }
    function getPitch2(frequencyData) {
        let intervals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        let noteNames = ["A", "B♭", "B", "C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "G♯"];
        let result = [];
        let scaleArray = ScaleInHz(27.5, 11 * 8, intervals);
        let peaks = [];
        let bfhz = "";
        let bestfactor = 1;
        for (let i = 0; i < frequencyData.length; i++) {
            let obj = {
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
                let [min, max] = [.95, 1.05];
                bestfactor = 1;
                for (let j = 0; j < scaleArray.length; j++) {
                    const noteRoot = scaleArray[j];
                    let factor = hz / noteRoot;
                    if (Math.abs(factor - 1) < bestfactor) {
                        bestfactor = Math.abs(factor - 1);
                        bfhz = hz.toFixed(2) + "/" + noteRoot.toFixed(2);
                        obj.hz = Util.round(hz, 2);
                        obj.tone = Util.round(noteRoot, 2);
                        obj.n = j;
                    }
                }
                obj.f = 1 / bestfactor;
                obj.bfhz = bfhz;
                peaks.push(obj);
            }
        }
        let sortf = function (a, b) {
            return b.f - a.f;
        };
        peaks.sort(sortf);
        let numberToKeep = peaks.length / 5;
        console.log("TOP 5:", peaks.slice(0, 5));
        result = peaks;
        return result;
    }
    function octavesCompose(aComp, frequencyData) {
        analyzer.getByteFrequencyData(frequencyData);
        let slize = frequencyData.slice(window.min / binsize, window.max / binsize);
        let intervals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        let noteNames = ["A", "B♭", "B", "C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "G♯"];
        let scaleArray = ScaleInHz(27.5, 11 * 8, intervals);
        for (let i = 0; i < slize.length; i++) {
            const hz = i * binsize;
            const amount = slize[i];
            let j = 0;
            for (j = 0; j < scaleArray.length; j++) {
                let cellnumber = j;
                let cell = Util.n2Cell(cellnumber, aComp.grid);
                let key = 0;
                const scaleHz = scaleArray[j];
                let dif = hz - scaleHz;
                if (Math.abs(dif) < binsize && amount > 128) {
                    let val = Number(aComp.get(cell));
                    let float = Math.pow((amount), 3);
                    let newval = val + float;
                    aComp.set(cell, val + float);
                    if (!aComp.options.max || newval > aComp.options.max) {
                        aComp.options.max = newval;
                    }
                    let [x, y] = Util.n2Xy(j, aComp.grid);
                    aComp.setProp(cell, "title", noteNames[x] + ":" + y + "=" + scaleHz.toFixed(2) + "hz");
                }
            }
        }
        let drawfun = function () {
            setTimeout(() => {
                aComp.refresh();
                octavesCompose(aComp, frequencyData);
            }, getSpeed());
        };
        if (PLAYING)
            requestAnimationFrame(drawfun);
    }
    function octavesCompose2(aComp, frequencyData) {
        analyzer.getByteFrequencyData(frequencyData);
        let slize = frequencyData.slice(window.min / binsize, window.max / binsize);
        let intervals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        let scaleArray = ScaleInHz(27.5, 11 * 8, intervals);
        console.log(scaleArray);
        debugger;
        for (let i = 0; i < slize.length; i++) {
            const hz = i * binsize;
            const amount = slize[i];
            let key = 0;
            let vals = [];
            for (let j = 0; j < scaleArray.length; j++) {
                const element = scaleArray[j];
                let dif = hz - element;
                if (Math.abs(dif) < binsize * 1) {
                    key = element;
                    let x = Math.floor(j % intervals.length);
                    let y = Math.floor(j / intervals.length);
                    key = Util.xy2Cell(x, y);
                    vals = [j, x, y];
                    break;
                }
            }
            if (key)
                aComp.set(key, hz);
        }
        let drawfun = function () {
            setTimeout(() => {
                aComp.refresh();
                octavesCompose(aComp, frequencyData);
            }, getSpeed());
        };
        if (PLAYING)
            requestAnimationFrame(drawfun);
    }
    function drawTimeData(timeData, ctx) {
        analyzer.getFloatTimeDomainData(timeData);
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#ffc600';
        ctx.beginPath();
        const sliceWidth = WIDTH * 1.0 / bufferLength;
        let x = 0;
        timeData.forEach((data, i) => {
            const v = data;
            const y = (v + 1) / 2 * HEIGHT;
            if (i === 0) {
                ctx.moveTo(x, y);
            }
            else {
                ctx.lineTo(x, y);
            }
            x += sliceWidth;
        });
        ctx.stroke();
        if (PLAYING)
            requestAnimationFrame(() => {
                setTimeout(() => drawTimeData(timeData, ctx), getSpeed());
            });
    }
    function drawWaterfall(frequencyData, ctx) {
        analyzer.getByteFrequencyData(frequencyData);
        ctx.clearRect(0, HEIGHT / 2, WIDTH, HEIGHT);
        let peak = 0;
        let ipeak = 0;
        let xpeak = 0;
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, HEIGHT / 2, WIDTH, HEIGHT);
        let barWidth = WIDTH / (window.max - window.min) * binsize;
        let barHeight;
        let x = 0;
        let i = 0;
        for (i = 0; i < bufferLength; i++) {
            const hz = i * binsize;
            if (hz > window.min && hz < window.max) {
                let percentHeight = frequencyData[i] / 255;
                barHeight = percentHeight * (HEIGHT / 2);
                const [h, s, l] = [percentHeight, 0.8, percentHeight];
                const [r, g, b] = Util.audio.hslToRgb(h, s, l);
                ctx.fillStyle = `hsl(${h * 360 + 100}, ${s * 100}%, ${l * 50}%)`;
                ctx.fillRect(x, HEIGHT - barHeight, barWidth, 50);
                ctx.fillRect(x, HEIGHT / 2 - 3, barWidth, 2);
                if (barHeight > peak) {
                    peak = barHeight;
                    xpeak = x;
                    ipeak = i;
                }
                x += barWidth;
            }
        }
        let imgData = ctx.getImageData(0, 0, WIDTH, HEIGHT / 2);
        ctx.putImageData(imgData, 0, -1);
        if (PLAYING)
            requestAnimationFrame(() => { drawWaterfall(frequencyData, ctx); });
    }
    function drawFrequency(frequencyData, ctx) {
        analyzer.getByteFrequencyData(frequencyData);
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        let peak = 0;
        let ipeak = 0;
        let xpeak = 0;
        let barWidth = WIDTH / (window.max - window.min) * binsize;
        let barHeight;
        let x = 0;
        let i = 0;
        for (i = 0; i < bufferLength; i++) {
            const hz = i * binsize;
            if (hz > window.min && hz < window.max) {
                barHeight = frequencyData[i] / 255 * HEIGHT * .9;
                const [h, s, l] = [frequencyData[i] / 255, 0.8, 0.5];
                const [r, g, b] = Util.audio.hslToRgb(h, s, l);
                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
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
        if (PLAYING)
            requestAnimationFrame(() => { drawFrequency(frequencyData, ctx); });
    }
    function getSpeed() { return (1000 / 60) / SPEED.animation; }
    ;
    return { visualizer, mp3Visualizer, micVisualizer };
})();
//# sourceMappingURL=Audio.js.map