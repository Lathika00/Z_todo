// Question 1: Print pattern
// 1
// 21
// 321
// ...
// n...1 (n times per row)

// Approach 1: Nested loops
function printPatternNestedLoops(n) {
  for (let row = 1; row <= n; row++) {
    let line = '';
    for (let col = row; col >= 1; col--) {
      line += col;
    }
    console.log(line);
  }
}

// Approach 2: Array + join
function printPatternArrayJoin(n) {
  for (let row = 1; row <= n; row++) {
    const digits = Array.from({ length: row }, (_, i) => row - i);
    console.log(digits.join(''));
  }
}

// Approach 3: String repeat + slice (build descending sequence)
function printPatternRecursion(n, row = 1) {
  if (row > n) return;
  console.log(Array.from({ length: row }, (_, i) => row - i).join(''));
  printPatternRecursion(n, row + 1);
}


const n = 5;
console.log('--- Approach 1: ');
printPatternNestedLoops(n);
console.log('\n--- Approach 2: ');
printPatternArrayJoin(n);
console.log('\n--- Approach 3: ');
printPatternRecursion(n);

