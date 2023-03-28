/**
 * Search a string by brute-force
 * @param {string} str 
 * @param {string} pattern 
 * @param {function} fn 
 * @returns {boolean} return true if the pattern is found in str
 */
async function searchByBruteForce(str, pattern, fn) {
    const strLen = str.length;
    const patternLen = pattern.length;
    const totalLengthToIterate = strLen - patternLen + 1;
    let jump = 0;

    for(let i = 0; i < totalLengthToIterate; i++) {
        operations += 1;
        
        let isFound = true;
        for (let j = 0; j < patternLen; j++) {
            operations += 1;
            const isEqual = str[i + j] === pattern[j];

            fn(i + j, j, jump, isEqual);

            if(!isEqual) {
                isFound = false;
                break;
            }

            await timer(WAIT_TIME);
        }

        if(isFound) {
            return true;
        }

        jump += 1;
        await timer(WAIT_TIME);
    }

    return false;
}

/**
 * Search a string by KMP
 * @param {string} str 
 * @param {string} pattern
 * @param {function} fn 
 * @returns {boolean} return true if the pattern is found in str 
 */
async function searchByKMP(str, pattern, fn) {
    const createTable = (s, sLen) => {
        const table = Array(sLen).fill(0);

        for (let i = 1, j = 0; i < sLen; i++) {
            operations += 1;
            while (j > 0 && s[j] !== s[i]) {
                operations += 1;
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
        operations += 1;
        while (j > 0 && str[i] !== pattern[j]) {
            operations += 1;
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

        await timer(WAIT_TIME);
    }

    return false;
}