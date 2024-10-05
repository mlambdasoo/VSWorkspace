var memberArray = ['sudong', 'lsd','leesudong']
console.log("memberArray[1]", memberArray[1]);

var meemberObject ={
    manager: 'sudong',
    developer: 'lsd',
    designer: 'leesudong'
}

console.log("member.designer", meemberObject.designer);
console.log("member.designer", meemberObject['designer']);
delete meemberObject.manager
console.log("after delete member.manager", meemberObject.manager);
