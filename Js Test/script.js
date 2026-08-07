// Question 1
function sayHello(name) {
    return `Hello, ${name}!`;
}

console.log(sayHello("Emma"));


// Question 2
const subtract = function (a,b) {
    return a - b;
};

console.log(subtract(10,4));


// Question 3
const divide = (x,y) => {
    return x/y;
};

console.log(divide(20,5));


// Question 4
function welcome(name = "Visitor", city = "Unknown") {
    return `${name} is from ${city}`;
}

console.log(welcome());
console.log(welcome("Emma", "Anambra"));


// Question 5
function operate(num, func1, func2) {
    return func2(func1(num));
}

// Helper functions
function double(n) {
    return n * 2;
}

function square(n) {
    return n * n;
}

console.log(operate(5, double, square));


// Question 6
(function () {
    console.log("I run immediately!");
})();


// Question 7
const car = {
    brand: "Toyota",
    getInfo() {
        return `This car is a ${this.brand}`;
    }
};

console.log(car.getInfo());


// Question 8
const isEven = (n) => {
    return n % 2 === 0;
};

console.log(isEven(8));
console.log(isEven(7));