// var person = {
//   name: 'Joe',
//   age: 21
// };
//
// function updatePerson(obj) {
//   obj.age = 24;
// }
//
// updatePerson(person);
// console.log(person);

// Array example

var grades  = [24,36];

function addGrade(grade) {
  grade.push(48);
  // Use debugger then in terminal node debug filename to Use
  // in terminal - cont is continue
  // repl can then inspect variables and functions
  // Then type array or function name to see it's attributes
  // and also use methods to change them
  // use ctrl c to exit
  // use kill to stop
  // use quit to exit degug
  debugger;
  // grade = [24,36,48];      This way won't work:
}

addGrade(grades);
console.log(grades);
