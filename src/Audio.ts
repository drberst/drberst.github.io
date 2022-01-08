import { Util } from "./Classes.js";
import SingleLayerComp from "./SingleLayerComp.js";

export default (function () {
    let WIDTH = 300;
    let HEIGHT = 243;
    const FFT_SIZE = 2 ** 11;
    const SPEED = { animation: 1 / 1 }
    const SMOOTHING = 0;

    let binsize = 1;
    let analyzer: AnalyserNode;
    let bufferLength;
    let PLAYING = true;
    let window = {
        min: 0,
        max: 2000,
        size: function () { return this.max - this.min }
    }
    // let ctx = {};

    function mp3Visualizer(aComp) {
        console.log("------------ Begin visualizer")
        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        // canvas.width = WIDTH;
        // canvas.height = HEIGHT;
        WIDTH = canvas.width;
        HEIGHT = canvas.height;
        const audioCtx = new AudioContext();
        const audio = new Audio("passwordshow.wav");
        // audio.playbackRate = SPEED.animation;
        const source = audioCtx.createMediaElementSource(audio);
        let t = 30;

        var listen = audioCtx.createGain();

        // * analyzer
        analyzer = audioCtx.createAnalyser();
        analyzer.smoothingTimeConstant = SMOOTHING;
        analyzer.fftSize = FFT_SIZE;
        // analyzer.maxDecibels = -45;
        // analyzer.minDecibels = -55;

        source.connect(listen);
        listen.connect(analyzer);
        // source.connect(analyzer);
        analyzer.connect(audioCtx.destination);
        // analyzer.
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
        let timeElapsed = 0;
        let cancel = setInterval(() => {
            timeElapsed += 1000;
            console.log("time", timeElapsed)
            if (timeElapsed >= t * 1000) {
                PLAYING = false;
                clearInterval(cancel);
            }
            // debugger;
        }, 1000);
        // drawTimeData(timeData, ctx);
        // drawFrequency(frequencyData, ctx);
        octavesCompose(aComp, frequencyData);

        // drawCompo(aComp, frequencyData);
    }
    function ScaleInHz(start, n, intervals?) {
        let majorscaletones = [0, 2, 4, 5, 7, 9, 11]
        // console.log(intervals);
        // debugger;
        if (typeof intervals == 'undefined') intervals = majorscaletones;
        let t = 0;
        let result = [];
        for (let i = 0; i <= n; i++) {
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
        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        // canvas.width = WIDTH;
        // canvas.height = HEIGHT;
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
        let majorscaletones = [0, 2, 4, 6, 8, 10, 12]
        let t = 0;
        for (let i = 0; i <= n; i++) {
            let val = 440 * 2 ** (i / 12);
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
        // drawTimeData(timeData);
        drawFrequency(frequencyData, ctx);
        octavesCompose(aComp, frequencyData);

    }

    function drawCompo(aComp, frequencyData) {
        analyzer.getByteFrequencyData(frequencyData);

        let count = 0;
        let dataEnd = 0;
        let iComp = 0;

        let end = bufferLength;
        let temp = 0;

        let stepsize = end / aComp.size();
        let peakval = 0;
        let iPeakval = "A0";

        let slize = frequencyData.slice(window.min / binsize, window.max / binsize);
        // console.log(slize);
        for (let i = 0; i < aComp.size(); i++) {

            const iBin = Math.floor(i / aComp.size() * slize.length);

            const hz = iBin * binsize;
            const amount = slize[iBin];
            // if (amount > 200) debugger;
            let key = Util.n2Cell(i, aComp.grid);

            // Key is hz
            // if (amount > 200 || amount < 120)
            aComp.set_bg(key, amount);
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

    function octavesCompose(aComp: SingleLayerComp, frequencyData) {
        analyzer.getByteFrequencyData(frequencyData);

        let slize = frequencyData.slice(window.min / binsize, window.max / binsize);
        // console.log(slize);
        let intervals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        let scaleArray = ScaleInHz(207, 12 * 6, intervals);

        for (let i = 0; i < slize.length; i++) {

            // const iBin = Math.floor(i / aComp.size() * slize.length);

            const hz = i * binsize;
            const amount = slize[i];
            let key = 0;
            let vals = [];
            for (let j = 0; j < scaleArray.length; j++) {
                const element = scaleArray[j];
                let dif = hz - element;
                if (Math.abs(dif) < binsize) {
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
            if (key && amount > 240)
                aComp.set(key, amount);
            else if (key && amount > 0)
                aComp.set(key, vals[0]);
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
            const y = (v + 1) / 2 * HEIGHT / 2;
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



    function drawFrequency(frequencyData, ctx) {
        // get the frequency data into our frequencyData array
        analyzer.getByteFrequencyData(frequencyData);
        // ctx.clearRect(0, 0, WIDTH, HEIGHT);

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
                barHeight = frequencyData[i] / 255 * HEIGHT / 2;
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
        ctx.strokeText(`${ipeak}(${Math.round(ipeak * binsize)}hz),${peak}`, xpeak, HEIGHT - peak - 10);
        // console.log("x", x, "counts", x / barWidth, "shouldequal", skippedbins);
        // console.log(xvalues);

        if (PLAYING)
            requestAnimationFrame(() => { drawFrequency(frequencyData, ctx) });
    }

    function getSpeed() { return (1000 / 60) / SPEED.animation };

    return { visualizer, mp3Visualizer };
})();