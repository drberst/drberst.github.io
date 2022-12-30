let Main = {
    divs: {
        Tank: document.getElementById("tank"),
        Healer: document.getElementById("healer"),
        damage1: document.getElementById("damage1"),
        damage2: document.getElementById("damage2"),
        damage3: document.getElementById("damage3"),
        enemy: document.getElementById("enemy"),
    },
    damageMulti: 1,
    interval: 0,
    loops: 0,
};
function setColors() {
    for (const key in Main.divs) {
        const element = Main.divs[key];
        const value = getBarValue(element);
        element.classList.remove("red");
        element.classList.remove("yellow");
        element.classList.remove("green");
        if (value <= 25) {
            element.classList.add("red");
        } else if (value <= 50) {
            element.classList.add("yellow");
        } else {
            element.classList.add("green");
        }
    }
}
function setWidthBasedOnValue() {
    for (const key in Main.divs) {
        const element = Main.divs[key];
        let value = element.getAttribute("aria-valuenow");
        // console.log("in setWidth:", value);
        element.style.width = `${value}%`;
    }
}

function getBarValue(element) {
    return Number(element.attributes["aria-valuenow"].value);
}
function setBarValue(element, aValue) {
    element.attributes["aria-valuenow"].value = aValue;
}
function adjustBarValue(element, delta) {
    let currentValue = getBarValue(element);
    element.attributes["aria-valuenow"].value = currentValue + delta;
    if (element.attributes["aria-valuenow"].value < 0) {
        element.attributes["aria-valuenow"].value = 0;
    }
    if (element.attributes["aria-valuenow"].value > 100) {
        element.attributes["aria-valuenow"].value = 100;
    }
}
function dropAllHp() {
    Main.loops++;

    // console.log(Main);
    // if (Main.loops >= 25) clearInterval(Main.interval);
    let livingPlayers = 0;
    for (const key in Main.divs) {
        const element = Main.divs[key];
        if (element.id !== "enemy" && getBarValue(element) > 0) {
            livingPlayers++;
        }

        if (element.id === "enemy") {
            if (Math.random() < 0.5) {
                adjustBarValue(element, -1);
            }
            if (getBarValue(element) === 0) {
                Main.flags.enemy_dead = true;
            }
        } else if (element.id === "healer") {
            if (Math.random() < 0.25) {
                adjustBarValue(element, -1);
            }
            if (getBarValue(element) === 0) {
                Main.flags.healer_dead = true;
            }
        } else if (element.id === "tank") {
            if (Math.random() < 0.5) {
                adjustBarValue(element, -1);
            }
            if (getBarValue(element) === 0) {
                Main.flags.tank_dead = true;
            }
        } else {
            // Damage
            if (Math.random() < 0.25 || Main.flags.tank_dead) {
                adjustBarValue(element, -1);
            }
        }
    }

    // if (Math.random() > 0.2) adjustBarValue(Main.enemydiv, -1);
    setColors();
    setWidthBasedOnValue();
    // console.log("living players:", livingPlayers);
    if (livingPlayers === 0) {
        endTheGame("DEFEAT");
    }
    if (Main.flags.enemy_dead) {
        endTheGame("VICTORY!");
    }
}
function endTheGame(msg) {
    clearInterval(Main.interval);

    setTimeout(() => {
        alert(`END OF GAME: ${msg}`);
    }, 100);
}
function findBarElement(clickEvent) {
    const element = clickEvent.target;
    let result = undefined;
    if (element.classList.contains("progress-outer")) {
        result = element.children[1];
        // to get the element tag name alone
        // Has my-class in it
    } else if (element.classList.contains("progress-inner")) {
        // console.log("value is ", getBarValue(element));
        result = element;
        // dont Have my-class
    } else if (element.classList.contains("progress-text")) {
        // console.log("Sibling is ", element.nextElementSibling);
        result = element.nextElementSibling;
        // dont Have my-class
    }
    return result;
}

function addClickEvents() {
    window.onclick = (e) => {
        // const element = e.target;
        // console.log(element.classList);
        let barElement = findBarElement(e);

        // console.log(barElement);
        if (barElement === undefined) {
            return;
        }
        if (Main.flags.healer_dead) {
            return;
        }
        if (getBarValue(barElement) > 0) {
            console.log(getBarValue(barElement));
            adjustBarValue(barElement, 50);
        }
    };
    window.addEventListener("auxclick", function (e) {
        // alert("middle button clicked");
        if (e.button === 1) {
            e.preventDefault();
            alert("middle button clicked");
        }
    });
}
Main.flags = {
    healer_dead: false,
    enemy_dead: false,
    tabk_dead: false,
};
Main.run = function () {
    console.log("DIVS", Main.divs);
    console.log("Dropping hp");
    Main.interval = setInterval(dropAllHp, 100);
    addClickEvents();
};

Main.stop = function () {
    clearInterval(Main.interval);
};

Main.run();
