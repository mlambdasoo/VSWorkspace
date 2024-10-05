var kim = {
    name: 'kim',
    first: 10,
    second: 20,
    third: 30,
    sum: function(){
        return this.first + this.second + this.third;
    }
}

var lee = {
    name: 'lee',
    first: 10,
    second: 10,
    third: 10,
    sum: function(){
        return this.first + this.second + this.third;
    }
}

console.log(kim.sum());
console.log(lee.sum());

var d1 = new Date('2024-05-23');
console.log(d1.getFullYear());

function Person(name, first, second, third){
        this.name = name;
        this.first = first;
        this.second = second;
        this.third = third;
        this.sum =  function(){
            return this.first + this.second + this.third;
        }
}
var kim_const = new Person('kim', 10,20,30);
var lee_const = new Person('lee', 10,10,10);
console.log(kim_const);
console.log(lee_const);