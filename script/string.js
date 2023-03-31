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

            await fn(i + j, j, jump, isEqual);

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
        operations += sLen;
        
        const table = Array(sLen).fill(-1);

        for (let i = 1; i < sLen; i++) {
            operations += 1;
            
            const idx = 1 + table[i - 1];
            
            if(s[i] === s[idx]){
                table[i] = idx;
            } else{
                table[i] = -1
            }  
        }

        return table;
    }

    const strLength = str.length;
    const patternLength = pattern.length;

    const table = createTable(pattern, patternLength);
    let i = 0, j = 0, jump = 0;
    while (i < strLength && j < patternLength) {
        operations += 1;

        if (str[i] === pattern[j]) {
            await fn(i, j, jump, true);
            i++;
            j++;
        } else if (j === 0) {
            await fn(i, j, jump + 1, false);
            i++;
            jump++;
        } else {
            const k = 1 + table[j - 1];
            await fn(i, j, i - k, false);
            j = k;
            jump = i - k;
        }

        await timer(WAIT_TIME);
    }

    return j === patternLength;
}