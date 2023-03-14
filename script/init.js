(function() {
}());

const str = document.getElementById("str");

str.onkeyup = function(e) {
    debounce(() => onStrKeyup(e), 500);
}

let timeout = null;
function debounce(func, delay) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(func, delay);
}

function onStrKeyup(e) {
    const container = document.getElementById("strContainer");
    console.log(e.target.value);

}

function onPatternKeyup(e) {
    const container = document.getElementById("patternContainer");


}