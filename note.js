let testNote = {
    name: "C0",
    hz: 16.35,
    root: "C0",
    rootHz: 16.35,
    interval: "-0",
};
let testNote2 = {
    name: "G0",
    hz: 24.5,
    root: "C0",
    rootHz: 16.35,
    interval: "^5",
};
function Note(props) {
    this.name = props.name;
    this.hz = props.hz;
    // this.root = props.root;
    // this.interval = props.interval;
    if (this.name === undefined && this.hz === undefined)
        // && this.root === undefined && this.interval === undefined)
        console.error("incomplete properties:", this);

    if (this.hz === undefined) {
        if (this.name === "rest") this.hz = 0;
        this.hz = notes[this.name];
    }
    if (this.name === undefined) {
        this.name = noteNames[this.hz];
    }
    // if (this.interval === undefined) {
    //     let aboveOrBelow = "v";
    //     if (this.hz > this.rootHz) aboveOrBelow = "^";
    //     this.interval = noteNames[this.hz];
    // }
}

Note.fromInterval = function (baseNote, interval) {
    if (interval === 0) return new Note({ name: baseNote });

    let indexOfBaseNote = nameArray.indexOf(baseNote);
    // debugger;
    let nameOfNewNote = nameArray[indexOfBaseNote + interval];
    if (indexOfBaseNote === -1 || nameOfNewNote === undefined) debugger;
    // console.log("interval: from", baseNote, "to", nameOfNewNote, interval);
    // debugger;
    return new Note({ name: nameOfNewNote });
};

// Note.fromHz = function (hz) {
//     return {
//         name: noteNames(hz),
//         hz: hz,
//     };
// };
// function getNoteIndex(noteName) {
//     let index = 0;
//     // let currentNote = notes;
//     for (const property in notes) {
//         console.log(`no match "${noteName}": "${property}": ${notes[property]}`);
//         // debugger;
//         if (String(property) == noteName) {
//             console.log(`found a match for "${noteName}": "${property}": ${notes[property]}`);
//             return index;
//         }
//         index++;
//     }
//     return index;
// }
const nameArray = [
    "C0",
    "Db0",
    "D0",
    "Eb0",
    "E0",
    "F0",
    "Gb0",
    "G0",
    "Ab0",
    "A0",
    "Bb0",
    "B0",
    "C1",
    "Db1",
    "D1",
    "Eb1",
    "E1",
    "F1",
    "Gb1",
    "G1",
    "Ab1",
    "A1",
    "Bb1",
    "B1",
    "C2",
    "Db2",
    "D2",
    "Eb2",
    "E2",
    "F2",
    "Gb2",
    "G2",
    "Ab2",
    "A2",
    "Bb2",
    "B2",
    "C3",
    "Db3",
    "D3",
    "Eb3",
    "E3",
    "F3",
    "Gb3",
    "G3",
    "Ab3",
    "A3",
    "Bb3",
    "B3",
    "C4",
    "Db4",
    "D4",
    "Eb4",
    "E4",
    "F4",
    "Gb4",
    "G4",
    "Ab4",
    "A4",
    "Bb4",
    "B4",
    "C5",
    "Db5",
    "D5",
    "Eb5",
    "E5",
    "F5",
    "Gb5",
    "G5",
    "Ab5",
    "A5",
    "Bb5",
    "B5",
    "C6",
    "Db6",
    "D6",
    "Eb6",
    "E6",
    "F6",
    "Gb6",
    "G6",
    "Ab6",
    "A6",
    "Bb6",
    "B6",
    "C7",
    "Db7",
    "D7",
    "Eb7",
    "E7",
    "F7",
    "Gb7",
    "G7",
    "Ab7",
    "A7",
    "Bb7",
    "B7",
    "C8",
];
const freqArray = [
    16.35, 17.32, 18.35, 19.45, 20.6, 21.83, 23.12, 24.5, 25.96, 27.5, 29.14, 30.87, 32.7, 34.65, 36.71, 38.89, 41.2, 43.65, 46.25, 49.0, 51.91, 55.0,
    58.27, 61.74, 65.41, 69.3, 73.42, 77.78, 82.41, 87.31, 92.5, 98.0, 103.83, 110.0, 116.54, 123.47, 130.81, 138.59, 146.83, 155.56, 164.81, 174.61,
    185.0, 196.0, 207.65, 220.0, 233.08, 246.94, 261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.0, 415.3, 440.0, 466.16, 493.88, 523.25,
    554.37, 587.33, 622.25, 659.25, 698.46, 739.99, 783.99, 830.61, 880.0, 932.33, 987.77, 1046.5, 1108.73, 1174.66, 1244.51, 1318.51, 1396.91,
    1479.98, 1567.98, 1661.22, 1760.0, 1864.66, 1975.53, 2093.0, 2217.46, 2349.32, 2489.02, 2637.02, 2793.83, 2959.96, 3135.96, 3322.44, 3520.0,
    3729.31, 3951.07, 4186.01,
];

const notes = {
    C0: 16.35,
    Db0: 17.32,
    D0: 18.35,
    Eb0: 19.45,
    E0: 20.6,
    F0: 21.83,
    Gb0: 23.12,
    G0: 24.5,
    Ab0: 25.96,
    A0: 27.5,
    Bb0: 29.14,
    B0: 30.87,
    C1: 32.7,
    Db1: 34.65,
    D1: 36.71,
    Eb1: 38.89,
    E1: 41.2,
    F1: 43.65,
    Gb1: 46.25,
    G1: 49.0,
    Ab1: 51.91,
    A1: 55.0,
    Bb1: 58.27,
    B1: 61.74,
    C2: 65.41,
    Db2: 69.3,
    D2: 73.42,
    Eb2: 77.78,
    E2: 82.41,
    F2: 87.31,
    Gb2: 92.5,
    G2: 98.0,
    Ab2: 103.83,
    A2: 110.0,
    Bb2: 116.54,
    B2: 123.47,
    C3: 130.81,
    Db3: 138.59,
    D3: 146.83,
    Eb3: 155.56,
    E3: 164.81,
    F3: 174.61,
    Gb3: 185.0,
    G3: 196.0,
    Ab3: 207.65,
    A3: 220.0,
    Bb3: 233.08,
    B3: 246.94,
    C4: 261.63,
    Db4: 277.18,
    D4: 293.66,
    Eb4: 311.13,
    E4: 329.63,
    F4: 349.23,
    Gb4: 369.99,
    G4: 392.0,
    Ab4: 415.3,
    A4: 440.0,
    Bb4: 466.16,
    B4: 493.88,
    C5: 523.25,
    Db5: 554.37,
    D5: 587.33,
    Eb5: 622.25,
    E5: 659.25,
    F5: 698.46,
    Gb5: 739.99,
    G5: 783.99,
    Ab5: 830.61,
    A5: 880.0,
    Bb5: 932.33,
    B5: 987.77,
    C6: 1046.5,
    Db6: 1108.73,
    D6: 1174.66,
    Eb6: 1244.51,
    E6: 1318.51,
    F6: 1396.91,
    Gb6: 1479.98,
    G6: 1567.98,
    Ab6: 1661.22,
    A6: 1760.0,
    Bb6: 1864.66,
    B6: 1975.53,
    C7: 2093.0,
    Db7: 2217.46,
    D7: 2349.32,
    Eb7: 2489.02,
    E7: 2637.02,
    F7: 2793.83,
    Gb7: 2959.96,
    G7: 3135.96,
    Ab7: 3322.44,
    A7: 3520.0,
    Bb7: 3729.31,
    B7: 3951.07,
    C8: 4186.01,
};
const noteNames = {
    16.35: "C0",
    17.32: "Db0",
    18.35: "D0",
    19.45: "Eb0",
    20.6: "E0",
    21.83: "F0",
    23.12: "Gb0",
    24.5: "G0",
    25.96: "Ab0",
    27.5: "A0",
    29.14: "Bb0",
    30.87: "B0",
    32.7: "C1",
    34.65: "Db1",
    36.71: "D1",
    38.89: "Eb1",
    41.2: "E1",
    43.65: "F1",
    46.25: "Gb1",
    49.0: "G1",
    51.91: "Ab1",
    55.0: "A1",
    58.27: "Bb1",
    61.74: "B1",
    65.41: "C2",
    69.3: "Db2",
    73.42: "D2",
    77.78: "Eb2",
    82.41: "E2",
    87.31: "F2",
    92.5: "Gb2",
    98.0: "G2",
    103.83: "Ab2",
    110.0: "A2",
    116.54: "Bb2",
    123.47: "B2",
    130.81: "C3",
    138.59: "Db3",
    146.83: "D3",
    155.56: "Eb3",
    164.81: "E3",
    174.61: "F3",
    185.0: "Gb3",
    196.0: "G3",
    207.65: "Ab3",
    220.0: "A3",
    233.08: "Bb3",
    246.94: "B3",
    261.63: "C4",
    277.18: "Db4",
    293.66: "D4",
    311.13: "Eb4",
    329.63: "E4",
    349.23: "F4",
    369.99: "Gb4",
    392.0: "G4",
    415.3: "Ab4",
    440.0: "A4",
    466.16: "Bb4",
    493.88: "B4",
    523.25: "C5",
    554.37: "Db5",
    587.33: "D5",
    622.25: "Eb5",
    659.25: "E5",
    698.46: "F5",
    739.99: "Gb5",
    783.99: "G5",
    830.61: "Ab5",
    880.0: "A5",
    932.33: "Bb5",
    987.77: "B5",
    1046.5: "C6",
    1108.73: "Db6",
    1174.66: "D6",
    1244.51: "Eb6",
    1318.51: "E6",
    1396.91: "F6",
    1479.98: "Gb6",
    1567.98: "G6",
    1661.22: "Ab6",
    1760.0: "A6",
    1864.66: "Bb6",
    1975.53: "B6",
    2093.0: "C7",
    2217.46: "Db7",
    2349.32: "D7",
    2489.02: "Eb7",
    2637.02: "E7",
    2793.83: "F7",
    2959.96: "Gb7",
    3135.96: "G7",
    3322.44: "Ab7",
    3520.0: "A7",
    3729.31: "Bb7",
    3951.07: "B7",
    4186.01: "C8",
};

function noteToHsl(note) {
    console.log("note is", note);
    const noteMap = {
        C: 0,
        Db: 30,
        D: 60,
        Eb: 90,
        E: 120,
        F: 150,
        Gb: 180,
        G: 210,
        Ab: 240,
        A: 270,
        Bb: 300,
        B: 330,
    };

    // Extract note name and octave from the note string
    const matches = note.match(/^([A-Gb#]+)(\d+)$/);
    if (!matches) return null;

    const [, noteName, octave] = matches;
    const hue = noteMap[noteName] || 0;
    const lightness = 50; // You can adjust lightness as needed
    const saturation = 50; // You can adjust saturation as needed

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function notesToIntervals(aKey, aList) {
    let result = [];
    let root = aKey.root;
    let majorIntervals = [0, 2, 4, 5, 7, 9, 11, 12];
    for (let i = 0; i < aList.length; i++) {
        let note = aList[i];

        if (note === 0) {
            result.push(new Note({ name: "rest", hz: 0 }));
        } else {
            if (note > majorIntervals.length) {
                // debugger;
                note = note % 8;
                octaveChange = Math.ceil(note / 8);
                const newInterval = majorIntervals[note - 1];
                const newNote = Note.fromInterval(root, newInterval + 12 * octaveChange);
                result.push(newNote);
            } else {
                const newInterval = majorIntervals[note - 1];
                const newNote = Note.fromInterval(root, newInterval);
                result.push(newNote);
            }
        }
    }
    return result;
}
let listOfIntervals = [1, 3, 5, 5, 3, 1, 0, 1, 3, 5, 7, 7, 7];
let listOfFormedNotes = notesToIntervals({ root: "C0", scale: "major" }, listOfIntervals);
console.log(listOfFormedNotes);
