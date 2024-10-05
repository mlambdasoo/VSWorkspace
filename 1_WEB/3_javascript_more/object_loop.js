var memberArray = ['sudong', 'lsd','leesudong']
var i = 0;
while(i < memberArray.length){
    console.log(memberArray[i]);
    i = i+1;
}


var meemberObject ={
    manager: 'sudong',
    developer: 'lsd',
    designer: 'leesudong'
}

console.group('object loop');
for ( key in meemberObject){
    console.log(key, meemberObject[key]);
}
console.groupEnd('object loop');
