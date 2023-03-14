/**
 * Search a string by brute-force
 * @param {string} str 
 * @param {string} pattern 
 * @returns {boolean} return true if pattern is found in str
 */
function searchByBruteForce(str, pattern) {
    const strLen = str.length;
    const patternLen = pattern.length;
    const totalLengthToIterate = strLen - patternLen;

    for(let i = 0; i < totalLengthToIterate; i++) {
        let isFound = true;
        for (let j = 0; j < strToFindLength; j++) {
            if(str[i + j] !== pattern[j]) {
                isFound = false;
                break;
            }
        }

        if(isFound) {
            return true;
        }
    }

    return false;
}

/**
 * Search a string by KMP
 * @param {string} str 
 * @param {string} pattern
 * @returns {boolean} return true if pattern is found in str 
 */
function searchByKMP(str, pattern) {
    function createTable(s, sLen) {
        const table = Array(sLen).fill(0);

        for (let i = 1, j = 0; i < sLen; i++) {
            while (j > 0 && s[j] !== s[i]) {
                j = table[j];
            }

            if (s[j] === s[i]) {
                table[i + 1] = ++j;
            }
        }

        return table;
    }

    const strLen = str.length;
    const patternLen = pattern.length;

    const table = createTable(pattern, patternLen);
    for (let i = 0, j = 0; i < strLen; i++) {
        while (j > 0 && str[i] !== pattern[j]) {
            j = table[j - 1];
        }

        if (str[i] === pattern[j]) {
            if (j === patternLen - 1) {
                return true;
            }
            else {
                j++;
            }
        }
    }

    return false;
}