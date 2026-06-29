
const input = [1, 2, 3, 6, 4, 3, 7, 4, 2, 6, 8, 2, 5, 9, 0, 1];
const expected = [1, 2, 3, 6, 4, 7, 8, 5, 9, 0];

// Approach 1: Set (preserves insertion order in modern JS)
function uniqueSet(arr) {
  return [...new Set(arr)];
}

// Approach 2: filter + indexOf
function uniqueFilterIndexOf(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

// Approach 3: reduce with Set tracker
function uniqueReduce(arr) {
  const seen = new Set();
  return arr.reduce((acc, item) => {
    if (!seen.has(item)) {
      seen.add(item);
      acc.push(item);
    }
    return acc;
  }, []);
}

// Approach 4: for loop with includes check
function uniqueForLoop(arr) {
  const result = [];
  for (const item of arr) {
    if (!result.includes(item)) {
      result.push(item);
    }
  }
  return result;
}

// Approach 5: Map (keys preserve order)
function uniqueMap(arr) {
  return [...new Map(arr.map((item) => [item, item])).values()];
}

console.log('Input:', input);
console.log('Expected:', expected);
console.log('Approach 1 (Set):', uniqueSet(input));
console.log('Approach 2 (filter + indexOf):', uniqueFilterIndexOf(input));
console.log('Approach 3 (reduce + Set):', uniqueReduce(input));
console.log('Approach 4 (for loop):', uniqueForLoop(input));
console.log('Approach 5 (Map):', uniqueMap(input));
