// # First Names of the People

// Create a file `index.js` in the <b>names</b> directory.

// Write a JS function in `index.js` with function name `getPeopleInCity` that accepts people names list and returns an array of containing the first names of the people.

// Export the function using the default export syntax.

// <b>Folder Structure</b>

// ```
// country
//     - state
//         - city
//             - index.js    // contains the people names list
// utilities
//     - utils
//         - index.js        // contains a function that returns the first names of the people
// names
//     - index.js            // create the file and write your code here
// ```

// Use the given modules.

// <b>Use Common JS module syntax</b>.

module.exports = [
  {firstName: 'Dorothy', lastName: 'Randall'},
  {firstName: 'Victor', lastName: 'Abraham'},
  {firstName: 'Lillian', lastName: 'Short'},
  {firstName: 'Owen', lastName: 'Rampling'},
  {firstName: 'Julia', lastName: 'Glover'},
  {firstName: 'Donna', lastName: 'Wilson'},
  {firstName: 'Rose', lastName: 'Anderson'},
  {firstName: 'Nicholas', lastName: 'McGrath'},
  {firstName: 'Warren', lastName: 'Langdon'},
  {firstName: 'Austin', lastName: 'Vaughan'},
]

const getFirstNames = list => {
  return list.map(eachPerson => eachPerson.firstName)
}

module.exports = getFirstNames


const peopleNameList = require('../country/state/city/index.js')

const arrOfFirstName = require('../utilities/utils/index.js')

function getPeopleInCity(peopleNameList) {
  return arrOfFirstName(peopleNameList)
}

module.exports = getPeopleInCity
