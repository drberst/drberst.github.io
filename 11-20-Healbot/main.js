let Main = {
    divs: {
        Tank: document.getElementById("tank"),
        Healer: document.getElementById("healer"),
        damage1: document.getElementById("damage1"),
        damage2: document.getElementById("damage2"),
        damage3: document.getElementById("damage3"),
    },
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
        if (value <= 25) element.classList.add("red");
        else if (value <= 50) element.classList.add("yellow");
        else element.classList.add("green");
    }
}
function setWidthBasedOnValue() {
    for (const key in Main.divs) {
        const element = Main.divs[key];
        let value = element.getAttribute("aria-valuenow");
        // console.log("in setWidth:", value);
        element.style.width = value + "%";
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
    if (element.attributes["aria-valuenow"].value < 0) element.attributes["aria-valuenow"].value = 0;
    if (element.attributes["aria-valuenow"].value > 100) element.attributes["aria-valuenow"].value = 100;
}
function dropAllHp() {
    Main.loops++;
    // console.log(Main);
    // if (Main.loops >= 25) clearInterval(Main.interval);
    for (const key in Main.divs) {
        const element = Main.divs[key];
        if (Math.random() > 0.5) adjustBarValue(element, -1);
    }
    setColors();
    setWidthBasedOnValue();
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
Main.run = function () {
    console.log("DIVS", Main.divs);
    console.log("Dropping hp");
    Main.interval = setInterval(dropAllHp, 100);
    window.onclick = (e) => {
        const element = e.target;
        // console.log(element.classList); // to get the element
        let barElement = findBarElement(e);

        console.log(barElement); // to get the element
        if (barElement !== undefined) adjustBarValue(barElement, 50);
    };
};

Main.run();
