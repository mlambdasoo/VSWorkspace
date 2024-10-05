var kim = {name:'kim', first:10, second:20}
var lee = {name:'lee', first:10, second:10}
function sum(prefix){
    return prefix + (this.first + this.second);
}

console.log(sum.call(kim, '=>'));

var kimsum = sum.bind(kim,'-> ');
console.log(kimsum());