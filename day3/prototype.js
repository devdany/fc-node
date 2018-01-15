function Car() {};

var myCar1 = new Car();
var myCar2 = new Car();

Car.prototype.color = 'red';
console.log(myCar1.color);
console.log(myCar2.color);

Car.prototype.color = 'blue';

console.log(myCar1.color);
console.log(myCar2.color);

