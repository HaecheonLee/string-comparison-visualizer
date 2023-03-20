(function() {
    init();
}());

function init() {
    initializeButton("btnToDraw", draw);
    initializeButton("btnToCompare", null)
}

function initializeButton(buttonId, onClick) {
    const button = document.getElementById(buttonId);

    if(!button) {
        return;
    }

    button.onclick = onClick;
}

function draw() {
    drawDOM("str", "strContainer");
    drawDOM("pattern", "patternContainer");
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

    removeChildElements(container);
    const itemContainer = makeItemContainer(inputValue);
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