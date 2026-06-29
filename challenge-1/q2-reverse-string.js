// Question 2: Reverse characters in a string
const input = 'Bhaskara';

// Approach 1: split, reverse, join
function reverseSplit(input) {
  return input.split('').reverse().join('');
}

// Approach 2: for loop (build new string)
function reverseForLoop(input) {
  let reversed = '';
  for (let i = input.length - 1; i >= 0; i--) {
    reversed += input[i];
  }
  return reversed;
}

// Approach 3: recursion
function reverseRecursion(input) {
  if (input.length <= 1) return input;
  return reverseRecursion(input.slice(1)) + input[0];
}

// Approach 4: Array.from + reverse
function reverseArrayFrom(input) {
  return Array.from(input).reverse().join('');
}

console.log('Input:', input);
console.log('Approach 1 (split/reverse/join):', reverseSplit(input));
console.log('Approach 2 (for loop):', reverseForLoop(input));
console.log('Approach 3 (reduce):', reverseReduce(input));
console.log('Approach 4 (recursion):', reverseRecursion(input));
console.log('Approach 5 (Array.from):', reverseArrayFrom(input));
