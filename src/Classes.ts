export { Being };
let maptag_behavior = new Map();
let Being2Behavior = new Map();
let hp_subs = [];
let pub_hp = new Array<LogEntry>();

class LogEntry {
    user;
    command;
    target;
    constructor(cmd, duder) {
        this.command = cmd;
        this.user = duder;
    }
}
abstract class Order {
    protected uid = Math.floor(Math.random() * 100000);
    protected type: string;
    public toString(): string {
        return 'UID: ' + this.uid + ' - Operation: ' + this.type;
    }
    abstract execute();
}
class Command {
    words;
    speaker;
    undo;

    constructor(words, speaker) {
        this.words = words;
        this.speaker = speaker;
    }
}

function upkeep_losehp(obj: { hp }) {
    obj.hp--;
    console.log("lost 1 hp", obj);
}

function resolvePubsub() {
    hp_subs.forEach(element => {
        element.react("hp",);
    });
}
maptag_behavior.set("#dying", upkeep_losehp);

class Being {
    static id_count = 0;
    interval_id;
    tempo;
    hp;
    known_cmd = [];
    handlers = [];
    triggers = [];
    // cmdqueue = [];
    constructor(tempo = 1000, hp = 10) {
        this.tempo = tempo;
        this.hp = hp;
        this.interval_id = Being.id_count++;
        // this.interval_id = setInterval(() => {
        // console.log("Being go brrrrrrr1");

        // }, this.tempo);
        this.start();
    }
    act(command, target) {
        if (this.known_cmd.includes(command)) {
            this.handlers[command](this, target);
        }
    }
    react(cmdname, target) {
        if (this.triggers.includes(cmdname)) {
            this.triggers[cmdname](target);
        }
    };
    start() {
        console.log("start ur engins");

        this.interval_id = setInterval(() => {
            console.log("Being#" + this.interval_id + " go brrrrrrr");
            // if (Being2Behavior.get(this)) Being2Behavior.get(this)();
            this.known_cmd.forEach(cmd => {
                this.handlers[cmd](this);
            });
        }, this.tempo);
    }

    stop() {
        clearInterval(this.interval_id);
    }
}
let Spot = new Being();
// Spot.known_cmd.push(upkeep_losehp);

// let Death = new Being();
let DM = new Being();


let losing1health = new Command("1 damage", Spot);
DM.known_cmd.push(losing1health.words);
DM.handlers[losing1health.words] = function (self, target) {
    self["known beings"] = [target];
    target.hp--;
    console.log(target, "is dying");
    if (target.hp < 0) console.log("dead");
    if (target.hp <= -10) {
        console.log("very dead");
        target.stop();
        self.stop();
    }
}
// Death.triggers["hp"] = function (target) {
//     console.log("Death is watching..", target)
//     if (target.hp <= 0) console.log("you're dead.");
// }

// Death.triggers >> figure out a simple pubsub thing tomorrow
    // Every monster could publish how much hp they lost
    // And Death would listen and check the damage and hp and either delete them,
    // or pass them to another person, some kind of clean up being
// Being2Behavior.set(Spot, [upkeep_losehp]);