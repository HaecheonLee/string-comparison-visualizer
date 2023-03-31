(function() {
    init();
}());

const timer = ms => new Promise(res => setTimeout(res, ms));

function init() {
    initializeDom("btnToCompare", compare, "onclick");
    initializeDom("algorithmList", onAlgorithmChange, "onchange");

    onAlgorithmChange();
}

function initializeDom(domId, fn, event) {
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

    drawDom("str", "strContainer");
    drawDom("pattern", "patternContainer");

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

function drawDom(inputId, containerId) {
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
    const str = document.getElementById("str").value
    const pattern = document.getElementById("pattern").value;
    let currentJump = 0;

    const isFound = await searchByBruteForce(str, pattern, async (strIndex, patternIndex, jump, isEqual) => {
        if (currentJump !== jump) {
            resetAllBackgronud(str.length, pattern.length);

            await timer(WAIT_TIME / 4);

            moveDom(jump);
            currentJump = jump;
        }

        await timer(WAIT_TIME / 4);
        paintItemContainer(strIndex, patternIndex, isEqual);
    });

    setResult(getResult(isFound));
}

async function runKMP() {
    const str = document.getElementById("str").value;
    const pattern = document.getElementById("pattern").value;
    let currentJump = 0;

    const isFound = await searchByKMP(str, pattern, async (strIndex, patternIndex, jump, isEqual) => {
        paintItemContainer(strIndex, patternIndex, isEqual);
    
        await timer(WAIT_TIME / 4);

        if (currentJump !== jump) {
            resetAllBackgronud(str.length, pattern.length);
            
            await timer(WAIT_TIME / 4);

            moveDom(jump);

            const nextPatternIndex = patternIndex - (jump - currentJump);
            paintDomFromStartToEnd("#strContainer .item-container", strIndex - nextPatternIndex, strIndex - 1, true);
            paintDomFromStartToEnd("#patternContainer .item-container", 0, nextPatternIndex - 1, true);
            currentJump = jump;
        }
    });

    setResult(getResult(isFound));
}

function resetAllBackgronud(strLength, patternLength) {
    resetBackground("#strContainer .item-box", 0, strLength);
    resetBackground("#patternContainer .item-box", 0, patternLength);
}

function paintDomFromStartToEnd(querySelector, startIndex, endIndex, isEqual) {
    for(let i = startIndex; i <= endIndex; i++) {
        paintDom(querySelector, i, isEqual);
    }
}

function paintItemContainer(strIndex, patternIndex, isEqual) {
    paintDom("#strContainer .item-container", strIndex, isEqual);
    paintDom("#patternContainer .item-container", patternIndex, isEqual);
}

function paintDom(querySelector, currentIndex, isEqual) {
    const container = document.querySelector(querySelector);

    if (!container) {
        return;
    }

    const itemBox = container.querySelector(`.item-box:nth-child(${currentIndex + 1})`);
    
    if (!itemBox) {
        return;
    }

    if (isEqual) {
        itemBox.style.backgroundColor = "green";
    } else {
        itemBox.style.backgroundColor = "red";
    }
}

function moveDom(jump) {
    const patternItemContainer = document.querySelector("#patternContainer .item-container");

    if (!patternItemContainer) {
        return;
    }

    patternItemContainer.style.marginLeft = `${100 * jump}px`;
}

function setOperation(text) {
    const operation = document.getElementById("operation");
    operation.textContent = text;
}

function setResult(text) {
    const result = document.getElementById("result");
    result.textContent = text;
}

function getResult(result) {
    if (result) {
        return "Found";
    }

    return "Not Found";
}

function resetBackground(containerQuery, startIndex, endIndex) {
    const containers = document.querySelectorAll(containerQuery);

    if (!containers?.length) {
        return;
    }

    const validateIndex = (index) => {
        return startIndex <= index && index <= endIndex
    }

    containers.forEach((p, index) => {
        if (validateIndex(index)) {
            p.style.backgroundColor = "";
        }
    });
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