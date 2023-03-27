(function() {
    init();
}());

function init() {
    initializeDOM("btnToDraw", draw, "onclick");
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

function compare() {
    const selectedValue = getAlgorithmListSelectedValue();

    if (selectedValue === null || selectedValue === undefined) {
        return;
    }

    switch(selectedValue) {
        case "1":
            break;
        case "2":
            break;
        case "3":
            break;
    }
}

function draw() {
    const isStrLengthLongerOrEqualToPatternLength = validateIfStrLengthLongerOrEqualToPatternLength();

    if (!isStrLengthLongerOrEqualToPatternLength) {
        alert("The string's length must be longer or equal to the pattern's length")
        return;
    }

    drawDOM("str", "strContainer");
    drawDOM("pattern", "patternContainer");
}

function onAlgorithmChange() {
    const selectedValue = getAlgorithmListSelectedValue();
    const shouldDisable = selectedValue === "0";

    toggleButton("btnToCompare", shouldDisable);
}

function toggleButton(buttonId, shouldDisable) {
    const button = document.getElementById(buttonId);

    if(!button) {
        return;
    }

    button.disabled = shouldDisable;
}

function drawDOM(inputId, containerId) {
    const input = document.getElementById(inputId);
    const container = document.getElementById(containerId);

    if (!input || !container) {
        return;
    }

    const { value: inputValue } = input;

    if (inputValue === null || inputValue === undefined) {
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
