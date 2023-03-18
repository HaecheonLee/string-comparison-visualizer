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
    const createTable = (s, sLen) => {
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

    const strLength = str.length;
    const patternLength = pattern.length;
    const patternLastIndex = patternLength - 1;

    const table = createTable(pattern, patternLength);
    for (let i = 0, j = 0; i < strLength; i++) {
        while (j > 0 && str[i] !== pattern[j]) {
            j = table[j - 1];
        }

        if (str[i] === pattern[j]) {
            if (j === patternLastIndex) {
                return true;
            }
            else {
                j++;
            }
        }
    }

    return false;
}