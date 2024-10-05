const add = (a,b) =>{
    return a+b;
};
console.log(add(2,4));

const squre = X => X*X;
console.log(squre(4));

const greet = () => console.log('heelo');
greet();

const getuser = (name, age) => ({
    name:name,
    age:age
});
console.log(getuser('Lee',30));


function Person(){
    this.age = 0;
    setInterval(() => {
        this.age++;
        console.log(this.age);
    }, 100);
}
const person = new Person();

const number = [1,2,3,4,5];
const squres = number.map(x => x*x);
console.log(squres);