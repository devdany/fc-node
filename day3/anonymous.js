function test(name, title, cb){
    this.name = name;
    this.title = title;
    console.log('call cb')
    cb(1,2,3,4);
}

test('name', 'title', function () {
    for(var i = 0; i<arguments.length; i++) {
        console.log(arguments[i]);
    }
})
