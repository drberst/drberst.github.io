const canvas = document.getElementById("visualization");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const DEBUG_AREA_HEIGHT = 100; // Height of the debug area
const MAIN_VISUALIZATION_START_Y = DEBUG_AREA_HEIGHT; // Y start position for main visualization

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256 * 2;
analyser.smoothingTimeConstant = 0.8; // Lower value for more responsiveness
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
let prevDataArray = new Uint8Array(bufferLength).fill(0);
const resolution = (48000 / analyser.fftSize) * 0.5;
// Frame counter and FPS calculation
let frameCounter = 0;
let lastFrameTime = performance.now();
let fps = 0;

// Array to hold the average values for the last 10 seconds
const averageHistory = [];
// const deviations = [];
const maxHistoryLength = 60 * 10; // Assuming 60 FPS, 10 seconds

async function setupAudio2() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        visualize();
    } catch (err) {
        console.error("Error accessing audio stream:", err);
    }
}
async function setupAudio() {
    console.log("start");
    // const fileInput = document.createElement("input");
    const fileInput = document.getElementById("chooseFile");
    // fileInput.type = "file";
    // fileInput.accept = "audio/mp3";
    // document.body.prepend(fileInput);
    // console.log(fileInput);
    fileInput.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("got file");
            const audioElement = new Audio(URL.createObjectURL(file));
            audioElement.crossOrigin = "anonymous"; // Ensures that the audio data can be accessed

            const source = audioContext.createMediaElementSource(audioElement);
            source.connect(analyser);
            analyser.connect(audioContext.destination); // If you want to hear the audio output
            audioElement.play();
            fileInput.style.display = "none";
            visualize();
        }
    });

    // fileInput.click();
}

function visualize() {
    requestAnimationFrame(visualize);
    analyser.getByteFrequencyData(dataArray);

    // Clear only the main visualization area
    ctx.clearRect(0, MAIN_VISUALIZATION_START_Y, WIDTH, HEIGHT - MAIN_VISUALIZATION_START_Y);
    ctx.fillStyle = "hsl(0, 0%, 20%)"; // Semi-transparent background
    ctx.fillRect(0, 100, WIDTH, HEIGHT);
    const barWidth = (WIDTH / bufferLength) * 2;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        if (dataArray[i] > prevDataArray[i]) {
            prevDataArray[i] = dataArray[i];
            // ctx.fillStyle = `hsl(${dataArray[i] * 360 + 100},100%, 50%)`;
        } else {
            // prevDataArray[i] *= 0.95; // Decay effect
            // ctx.fillStyle = `hsl(${dataArray[i] * 360 * 0.5 + 100}, 50%, 40%)`;
        }

        const value = dataArray[i];
        // barHeight = prevDataArray[i] * 2;
        barHeight = value * 2;
        ctx.fillStyle = `hsl(${x / 4}, ${(value / 255) * 200 - 50}%,  ${(value / 255) * 200 - 120}%)`;
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
        x += barWidth;
    }

    // Update debugging information every 15 frames
    frameCounter++;
    if (frameCounter % 1 === 0) {
        // Clear the debug area
        ctx.clearRect(0, 0, WIDTH, DEBUG_AREA_HEIGHT);

        calculateFPS();

        updateAverageHistory();
        // printDebugInfo();
    }
    drawWaveform();
    drawMiniGraph();
}

function updateAverageHistory() {
    const averageValue = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    const mean = averageHistory.reduce((sum, value) => sum + value, 0) / averageHistory.length;
    // if (averageHistory.length > 10) {
    //     let deviationSum = 0;
    //     for (let i = 0; i < averageHistory.length; i++) {
    //         deviationSum += Math.pow(averageHistory[i] - mean, 2);
    //     }
    //     const deviation = Math.sqrt(deviationSum / averageHistory.length);
    //     deviations.push(deviation);
    //     if (Number.isNaN(deviation)) debugger;
    // } else {
    //     deviations.push(0);
    // }

    // const averageValue = dataArray.reduce((sum, value) => sum + value, 0) / waveformArray.length;
    // const averageValue = waveformArray.reduce((sum, value) => sum + value, 0) / waveformArray.length;

    // console.log(averageValue);
    // const averageValue = dataArray.reduce((sum, value) => value, 0);

    // Add the new average value to the history
    averageHistory.push(averageValue);

    // Remove the oldest value if the history exceeds the max length
    if (averageHistory.length > maxHistoryLength) {
        averageHistory.shift();
    }
}
function getStandardDeviation(array) {
    const n = array.length;
    if (n === 0 || n === 1) return 0;
    const mean = array.reduce((a, b) => a + b) / n;
    return Math.sqrt(array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
}

function printDebugInfo() {
    const currentTime = new Date().toLocaleTimeString();
    const averageValue = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

    // Find peak frequency and amplitude
    let maxAmplitude = 0;
    let peakFrequencyIndex = 0;
    for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i] > maxAmplitude) {
            maxAmplitude = dataArray[i];
            peakFrequencyIndex = i;
        }
    }
    const peaks = [];

    for (let i = 0; i < dataArray.length; i++) {
        peaks.push({ frequencyIndex: i, amplitude: dataArray[i] });
    }

    // Sort the peaks array by amplitude in descending order
    peaks.sort((a, b) => b.amplitude - a.amplitude);

    // Get the top 5 peaks
    const topPeaks = peaks.slice(0, 5);

    // Calculate dBFS level (average decibel level)
    const sumSquares = dataArray.reduce((sum, value) => sum + value * value, 0);
    const rms = Math.sqrt(sumSquares / dataArray.length);
    const dBFS = 20 * Math.log10(rms / 255); // Normalize by max value (255)

    // Display debugging information on the canvas
    ctx.font = "20px monospace";
    ctx.fillStyle = "black";

    // ctx.fillText(`Time: ${currentTime}`, 10, 30);
    ctx.fillText(`Bin Size: ${audioContext.sampleRate / analyser.fftSize} hz`, 10, 30);

    ctx.fillText(`Avg Value: ${averageValue.toFixed(2)}`, 10, 60);
    ctx.fillStyle = `hsl(${peakFrequencyIndex},100%, 50%)`;
    const f = peakFrequencyIndex * resolution;
    ctx.fillText(`Peak Frequency: ${f.toFixed(0)} Hz`, 10, 90);

    //// All this is for top 5 peaks, but it was too messy
    // let z = 0;
    // for (const element of topPeaks) {
    //     const number = Math.floor(element.frequencyIndex * resolution * 2);
    //     const percent = ((element.amplitude / 255) * 100).toFixed(0);
    //     const hzPosition = (WIDTH / bufferLength) * 2.5 * element.frequencyIndex;
    //     const x = element.frequencyIndex * (WIDTH / bufferLength) * 2.5;
    //     // ctx.fillStyle = `hsl(${element.amplitude / 4}, ${percent}%, 50%)`;
    //     ctx.fillStyle = `hsl(${x / 4}, ${(element.amplitude / 255) * 100 + 0}%, 50%)`;

    //     ctx.fillText(`${number}Hz ${percent}%`, hzPosition + 10, 160 + z * 30);
    //     // ctx.fillRect(hzPosition, HEIGHT - element.amplitude * 2, 5, 5);
    //     ctx.fillRect(hzPosition, 160 + z * 30 - 30, 2, 30);
    //     // ctx.strokeStyle = "black";
    //     // ctx.lineWidth = 1;
    //     // ctx.strokeText(`${element.frequencyIndex}Hz`, 10 + hzPosition, 160 + z * 30);
    //     z++;
    // }
    // topPeaks.forEach((peak, index) => {
    //     const frequency = (peak.frequencyIndex * audioContext.sampleRate) / analyser.fftSize;
    //     const x = peak.frequencyIndex;
    //     const hzPosition = (WIDTH / bufferLength) * 2.5 * peak.frequencyIndex;
    //     ctx.fillStyle = `hsl(${x / 4}, ${(peak.amplitude / 255) * 100 + 0}%, 50%)`;

    //     ctx.fillText(`|${frequency.toFixed(0)} Hz, Amplitude: ${peak.amplitude}`, 10 + hzPosition, 120 + index * 30);
    // });
    ctx.fillStyle = "black";
    const percent = ((maxAmplitude / 255) * 100).toFixed(2);
    const newColumn = 280;
    // ctx.fillText(`Peak Amplitude: ${percent}%`, WIDTH - 550, 30);
    // ctx.fillText(`Peak Amplitude: ${percent}%`, newColumn, 90);
    // ctx.fillText(`FPS: ${fps.toFixed(0)} / ${(fps * 6).toFixed(0)} `, newColumn, 30);
    // ctx.fillText(`FPS: ${fps.toFixed(0)} / ${(fps / 6).toFixed(1)} `, newColumn, 30);

    // ctx.fillText(`dBFS: ${dBFS.toFixed(2)} dB`, newColumn, 60);
    // ctx.fillText(`Canvas Size: ${WIDTH}x${HEIGHT}`, newColumn + 10, 90);
}

function drawMiniGraph() {
    // Define the position and size of the mini graph
    const graphX = 0; // Position on the right side
    const graphY = 0; // Position near the top
    const graphWidth = WIDTH;
    const graphHeight = 100;

    // Draw the background of the graph
    ctx.fillStyle = "hsl(0, 0%, 40%)"; // Semi-transparent background
    // ctx.fillStyle = "rgba(0, 0, 0, 0.2)"; // Semi-transparent background
    ctx.fillRect(0, graphY, WIDTH, graphHeight);
    const dev = getStandardDeviation(averageHistory);
    // Draw the line graph for the average values
    ctx.strokeStyle = "yellow";
    ctx.beginPath();
    // const start = averageHistory.length - 10;
    for (let i = 0; i < averageHistory.length; i++) {
        let value = (averageHistory[i] / 255) * 2;
        // let value = (averageHistory[i] / dev) * 0.051;
        // if (Math.random() > 0.999) console.log("value", averageHistory[i].toFixed(2), "/", dev.toFixed(2), "=", value.toFixed(2));

        // if (value > 2) value *= 0.5;

        // const deviation = Math.sqrt((value - averageHistory[i]) ^ 2);
        const scaledX = graphX + (i / averageHistory.length) * graphWidth;
        // const scaledY = graphY + graphHeight - 1 * (averageHistory[i] / 255) * graphHeight;
        let scaledY = graphY + graphHeight - graphHeight * value;
        if (i === 0) {
            ctx.moveTo(scaledX, scaledY);
        } else {
            ctx.lineTo(scaledX, scaledY);
        }
        // if ((i + 1) % 21 === 0 || i === averageHistory.length - 1) {
        if (i === averageHistory.length - 1) {
            ctx.lineTo(WIDTH, scaledY);
            // ctx.lineTo(scaledX + 10, 110);
            // ctx.moveTo(scaledX, scaledY);
        }
    }
    ctx.stroke();
}
const waveformArray = new Uint8Array(analyser.fftSize);
function drawWaveform() {
    // Get the time-domain data from the analyser node
    analyser.getByteTimeDomainData(waveformArray);

    // Set the waveform drawing area dimensions
    const waveformWidth = WIDTH; // Adjust width for the waveform area
    const waveformHeight = 400; // Height of the waveform area
    const waveformX = 0; // Start drawing from the right side
    const waveformY = 100; // Start at the top
    // Draw the background of the graph
    // ctx.fillStyle = "hsl(0, 0%, 40%)"; // Semi-transparent background
    // ctx.fillRect(0, waveformY, WIDTH, 300);
    // Clear the area where the waveform will be drawn
    // ctx.clearRect(waveformX, waveformY, waveformWidth, waveformHeight);

    // Set up the drawing style
    ctx.lineWidth = 2;
    ctx.strokeStyle = "lime"; // Choose a color for the waveform
    ctx.beginPath();

    // Calculate the step size for drawing the waveform
    const sliceWidth = waveformWidth / waveformArray.length;

    // Start drawing the waveform
    for (let i = 0; i < waveformArray.length; i++) {
        const x = waveformX + i * sliceWidth;
        const y = waveformY + (waveformArray[i] / 255.0) * waveformHeight;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.stroke();
}

function calculateFPS() {
    const now = performance.now();
    const deltaTime = now - lastFrameTime;
    fps = 1000 / deltaTime;
    lastFrameTime = now;
}

setupAudio();
