(function() {
    init();
}());

const timer = ms => new Promise(res => setTimeout(res, ms));

function init() {
    initializeDOM("btnToCompare", compare, "onclick");
    initializeDOM("algorithmList", onAlgorithmChange, "onchange");

    onAlgorithmChange();
}

function initializeDOM(domId, fn, event) {
    const dom = document.getElementById(domId);

    if(!dom) {
        return;
    }

    switch (event) {
        case "onclick":
            dom.onclick = fn;
            break;
        case "onchange":
            dom.onchange = fn;
            break;
    }
}

async function compare() {
    const selectedValue = getAlgorithmListSelectedValue();

    if (selectedValue === null || selectedValue === undefined) {
        alert("Choose an algorithm from the list");
        return;
    }

    removeItemContainer()
    const isDrawingSuccessful = draw();

    if (!isDrawingSuccessful) {
        return;
    }

    const strItemContainer = document.querySelector("#strContainer .item-container");
    const patternItemContainer = document.querySelector("#patternContainer .item-container");

    if (!strItemContainer || !patternItemContainer) {
        alert("Enter valid string");
        return;
    }

    resetBeforeCompare();
    switch(selectedValue) {
        case "1":
            await runBruteForce();
            break;
        case "2":
            await runKMP();
            break;
    }
    enableOrDisableAllElements(false);
    setOperation(operations);
}

function removeItemContainer() {
    const strContainer = document.querySelector("#strContainer");
    const patternContainer = document.querySelector("#patternContainer");

    if (strContainer) {
        removeChildElements(strContainer);
    }

    if (patternContainer) {
        removeChildElements(patternContainer);
    }
}

function draw() {
    const isStrLengthLongerOrEqualToPatternLength = validateIfStrLengthLongerOrEqualToPatternLength();

    if (!isStrLengthLongerOrEqualToPatternLength) {
        alert("The string's length must be longer or equal to the pattern's length")
        return false;;
    }

    drawDOM("str", "strContainer");
    drawDOM("pattern", "patternContainer");

    return true;
}

function onAlgorithmChange() {
    const selectedValue = getAlgorithmListSelectedValue();
    const shouldDisable = selectedValue === "0";

    enableOrDisableElement("btnToCompare", shouldDisable);
}

function enableOrDisableElement(elementId, shouldDisable) {
    const element = document.getElementById(elementId);

    if(!element) {
        return;
    }

    element.disabled = shouldDisable;
}

function drawDOM(inputId, containerId) {
    const input = document.getElementById(inputId);
    const container = document.getElementById(containerId);

    if (!input || !container) {
        return;
    }

    const { value: inputValue } = input;

    if (!inputValue) {
        return;
    }
    
    const itemContainer = makeItemContainer(inputValue);
    removeChildElements(container);
    container.appendChild(itemContainer);
}

function removeChildElements(container) {
    if (!container) {
        return;
    }

    while (container.firstChild) {
        container.removeChild(container.lastChild);
    }
}   

function makeItemContainer(str) {
    const itemContainer = document.createElement("div");
    itemContainer.classList.add("item-container");

    const { length } = str;
    for(let i = 0; i < length; i++) {
        const item = makeItemBox(str[i]);
        itemContainer.appendChild(item);
    }

    return itemContainer;
}

function makeItemBox(textValue) {
    const item = document.createElement("div");
    item.classList.add("item-box");
    item.append(textValue);

    return item;
}

function validateIfStrLengthLongerOrEqualToPatternLength() {
    const str = document.getElementById("str");
    const pattern = document.getElementById("pattern");

    const strValue = str.value;
    const patternValue = pattern.value;

    return strValue.length >= patternValue.length;
}

function getAlgorithmListSelectedValue() {
    const algorithmList = document.getElementById("algorithmList");
    
    if (!algorithmList) {
        return null;
    }

    return algorithmList.value;
}

async function runBruteForce() {
    const str = document.getElementById("str")
    const pattern = document.getElementById("pattern");
    let currentJump = 0;

    const isFound = await searchByBruteForce(str.value, pattern.value, (strIndex, patternIndex, jump, isEqual) => {
        if (currentJump !== jump) {
            moveDOM(jump);
            currentJump = jump;
        }
        paintDOM(strIndex, patternIndex, isEqual);
    });

    setResult(getResult(isFound));
}

async function runKMP() {
    const str = document.getElementById("str")
    const pattern = document.getElementById("pattern");
    let currentJump = 0;

    const isFound = await searchByKMP(str.value, pattern.value, (strIndex, patternIndex, jump, isEqual) => {
        if (currentJump !== jump) {
            moveDOM(jump);
            currentJump = jump;
        }
        paintDOM(strIndex, patternIndex, isEqual);
    });

    setResult(getResult(isFound));
}

async function paintDOM(currentStrIndex, currentPatternIndex, isEqual) {
    const strItemContainer = document.querySelector("#strContainer .item-container");
    const patternItemContainer = document.querySelector("#patternContainer .item-container");

    if (!strItemContainer || !patternItemContainer) {
        alert("One of containers does not have an item container.");
        return;
    }

    const strItembox = strItemContainer.querySelector(`.item-box:nth-child(${currentStrIndex + 1})`);
    const patternItembox = patternItemContainer.querySelector(`.item-box:nth-child(${currentPatternIndex + 1})`);
    
    if (isEqual) {
        const colorGreen = "green";

        strItembox.style.backgroundColor = colorGreen;
        patternItembox.style.backgroundColor = colorGreen;

        await timer(WAIT_TIME / 3);
    } else {
        const colorRed = "red";
        strItembox.style.backgroundColor = colorRed;
        patternItembox.style.backgroundColor = colorRed;

        await timer(WAIT_TIME / 3);

        resetBackground();
    }
}

async function moveDOM(jump) {
    const patternItemContainer = document.querySelector("#patternContainer .item-container");

    if (!patternItemContainer) {
        return;
    }

    patternItemContainer.style.marginLeft = `${100 * jump}px`;
    await timer(WAIT_TIME / 3);
}

function setOperation(text) {
    const operationDOM = document.getElementById("operation");
    operationDOM.textContent = text;
}

function setResult(result) {
    const resultDOM = document.getElementById("result");
    resultDOM.textContent = result;
}

function getResult(result) {
    if (result) {
        return "Found";
    }

    return "Not Found";
}

function resetBackground() {
    const strItemboxes = document.querySelectorAll('#strContainer .item-box');
    const patternItemboxes = document.querySelectorAll('#patternContainer .item-box');

    if (!strItemboxes || !patternItemboxes) {
        return;
    }

    strItemboxes.forEach(p => p.style.backgroundColor = "");
    patternItemboxes.forEach(p => p.style.backgroundColor = "");
}

function resetMargin() {
    const patternItemContainer = document.querySelector("#patternContainer .item-container");

    if (!patternItemContainer) {
        return;
    }

    patternItemContainer.style.marginLeft = "";
}

function resetBeforeCompare() {
    operations = 0;
    enableOrDisableAllElements(true);
    resetBackground();
    resetMargin();
    setOperation("calculating...");
    setResult("running...");
}

function enableOrDisableAllElements(shouldEnable) {
    const idList = ["str", "pattern", "algorithmList", "btnToCompare"];

    for (const id of idList) {
        const element = document.getElementById(id);

        if (!element) {
            continue;
        }

        element.disabled = shouldEnable;
    }
}