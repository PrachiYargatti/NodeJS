
// # Calculate Ratio and Factorial

// Create a file `index.js` in the <b>ratioFactorial</b> directory.

// Write a JS function in `index.js` that accepts 3 numbers as arguments and return the ratio of the first two numbers and factorial of the third number in an object with keys as `ratio` and `factorial`.

// Export the function using default export syntax.

// <b>Folder Structure</b>

// ```
// utilities
//     - factorial
//         - index.js         // contains a function that returns the factorial of the given number

//     - ratio
//         - index.js         // contains a function that returns the ratio of 2 given numbers

//     - ratioFactorial
//         - index.js         // create the file and write your code here
// ```

// Use the functions provided in the ratio and factorial directories.

// <b>Use Common JS module syntax</b>.

function ratioOfTwoNumbers(num1, num2) {
  return num1 / num2
}

module.exports = ratioOfTwoNumbers

function factorialOfNumber(num) {
  let factorial = 1
  while (num !== 0) {
    factorial *= num--
  }
  return factorial
}

module.exports = factorialOfNumber


const ratioOfTwoNumbers = require('../ratio/index.js')
const factorialOfNumber = require('../factorial/index.js')

function ratioAndFactorial(n1, n2, n3) {
  return {
    ratio: ratioOfTwoNumbers(n1, n2),
    factorial: factorialOfNumber(n3),
  }
}

module.exports = ratioAndFactorial
