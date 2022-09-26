const guitarLowE = ["E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3", "C#3", "D3", "D#3", "E3"];
const guitarA = ["A2", "A#2", "B2", "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3"];
const guitarD = ["D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", "C4", "C#4", "D4"];
const guitarG = ["G3", "G#3", "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4"];
const guitarB = ["B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4"];
const guitarHighE = ["E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5", "C#5", "D5", "D#5", "E5"];
const MAJOR_KEYS = ["C", "F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb", "G", "D", "A", "E", "B", "F#", "C#"];
const MINOR_KEYS = ["Am", "Dm", "Gm", "Cm", "Fm", "Bbm", "Ebm", "Abm", "Em", "Bm", "F#m", "C#m", "G#m", "D#m", "A#m"];
const ALLNOTES = [
    "C0",
    "C#0",
    "D0",
    "D#0",
    "E0",
    "F0",
    "F#0",
    "G0",
    "G#0",
    "A0",
    "A#0",
    "B0",
    "C1",
    "C#1",
    "D1",
    "D#1",
    "E1",
    "F1",
    "F#1",
    "G1",
    "G#1",
    "A1",
    "A#1",
    "B1",
    "C2",
    "C#2",
    "D2",
    "D#2",
    "E2",
    "F2",
    "F#2",
    "G2",
    "G#2",
    "A2",
    "A#2",
    "B2",
    "C3",
    "C#3",
    "D3",
    "D#3",
    "E3",
    "F3",
    "F#3",
    "G3",
    "G#3",
    "A3",
    "A#3",
    "B3",
    "C4",
    "C#4",
    "D4",
    "D#4",
    "E4",
    "F4",
    "F#4",
    "G4",
    "G#4",
    "A4",
    "A#4",
    "B4",
    "C5",
    "C#5",
    "D5",
    "D#5",
    "E5",
    "F5",
    "F#5",
    "G5",
    "G#5",
    "A5",
    "A#5",
    "B5",
    "C6",
    "C#6",
    "D6",
    "D#6",
    "E6",
    "F6",
    "F#6",
    "G6",
    "G#6",
    "A6",
    "A#6",
    "B6",
    "C7",
    "C#7",
    "D7",
    "D#7",
    "E7",
    "F7",
    "F#7",
    "G7",
    "G#7",
    "A7",
    "A#7",
    "B7",
    "C8",
    "C#8",
    "D8",
    "D#8",
    "E8",
    "F8",
    "F#8",
    "G8",
    "G#8",
    "A8",
    "A#8",
    "B8",
    "C9",
    "C#9",
    "D9",
    "D#9",
    "E9",
    "F9",
    "F#9",
    "G9",
    "G#9",
    "A9",
    "A#9",
    "B9",
];
const GUITARNOTES = [["1 indexed"], guitarHighE, guitarB, guitarG, guitarD, guitarA, guitarLowE];

function midinote(number) {
    return ALLNOTES[number - 12];
}
function note2midi(note) {
    const index = ALLNOTES.indexOf(note);
    return index + 12;
}
// const guitarString = [guitarLowE, guitarA, guitarD, guitarG, guitarB, guitarHighE]

let guitarresult = 1;

function freq2note(input) {}

let Transposer = {};
Transposer.guitar2note = function (input) {
    let str = input.str;
    let fret = input.fret;
    if (str !== undefined && fret !== undefined) {
        // console.log("good Input:", input);
        let result = GUITARNOTES[str][fret];
        // console.log("good result?", result);
        return result;
    } else {
        console.log("bad Input:", input);
    }
};

Transposer.fixChord = function (strArray) {
    console.log("fix chord before:", strArray);
    let counts = [[], [], [], [], [], []];
    let onePerString = [];
    for (let i = 0; i < strArray.length; i++) {
        const element = strArray[i];
        counts[element.str - 1].push(element);
    }
    for (let i = 0; i < counts.length; i++) {
        const element = counts[i];
        if (element.length > 1) {
            // console.log("duplicate on string", element);
            let max = element.length;
            let roll = Math.floor(Math.random() * max);
            // console.log("rolled", roll, "out of", max);
            onePerString[i] = counts[i][roll];
        } else {
            onePerString[i] = counts[i][0];
        }
        // counts[element.str-1].push(element);
    }
    onePerString = onePerString.filter(function (element) {
        return element !== undefined;
    });
    console.log("fix chord after:", onePerString);
    return onePerString;
};

Transposer.note2guitar = function (noteName) {
    let result = [];
    for (let iStr = 1; iStr <= 6; iStr++) {
        let index = GUITARNOTES[iStr].indexOf(noteName);
        if (index === -1) {
            let octave = 2;
        } else {
            result.push({ str: iStr, fret: index });
        }
    }
    // console.log("Guitar Result:", result);
    return result;
};
Transposer.note2guitar_allOctaves = function (noteName) {
    let result = [];
    // Guitar spans octaves E2 to E5
    for (let octave = 2; octave <= 5; octave++) {
        result = result.concat(Transposer.note2guitar(noteName + octave));
    }
    // console.log("Guitar Result:", result);
    return result;
};

Transposer.freq2note = function (input) {
    const data = "thedata";

    var A4 = 440.0;
    var A4_INDEX = 57;
    var notes = ALLNOTES;

    // console.log("guitar result:", guitarresult);

    var MINUS = 0;
    var PLUS = 1;
    var side = PLUS;

    var frequency;
    var r = Math.pow(2.0, 1.0 / 12.0);
    var cent = Math.pow(2.0, 1.0 / 1200.0);
    var r_index = 0;
    var cent_index = 0;
    frequency = A4;

    if (input >= frequency) {
        while (input >= r * frequency) {
            frequency = r * frequency;
            r_index++;
        }
        while (input > cent * frequency) {
            frequency = cent * frequency;
            cent_index++;
        }
        if (cent * frequency - input < input - frequency) cent_index++;
        if (cent_index > 50) {
            r_index++;
            cent_index = 100 - cent_index;
            if (cent_index != 0) side = MINUS;
            else side = PLUS;
        } else side = PLUS;
    } else {
        while (input <= frequency / r) {
            frequency = frequency / r;
            r_index--;
        }
        while (input < frequency / cent) {
            frequency = frequency / cent;
            cent_index++;
        }
        if (input - frequency / cent < frequency - input) cent_index++;
        if (cent_index >= 50) {
            r_index--;
            cent_index = 100 - cent_index;
            side = PLUS;
        } else {
            if (cent_index != 0) side = MINUS;
            else side = PLUS;
        }
    }

    var result = notes[A4_INDEX + r_index];
    if (side == PLUS) result = result + " plus ";
    else result = result + " minus ";
    result = result + cent_index + " cents";
    this.result = result;
    console.log("result:", result);
    // return result;

    this.data = data;

    // result = arr.find(element => {
    //     return element > 2;
    // });
    this.test = function () {
        console.log("this is the transposer test");
    };

    return this;
};

export default Transposer;
