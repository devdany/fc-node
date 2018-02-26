require('./removeByValue')();

module.exports = function(io) {
    var userList = [];
    io.on('connection', socket => {

        var session = socket.request.session.passport;
        var user = (typeof session !== 'undefined') ? (session.user) : "";

        //userList에 사용자 명이 존재하지 않으면 삽입

        if(userList.indexOf(user.displayname) === -1) {
            userList.push(user.displayname);
        }
        io.emit('join', userList);

        socket.on('client message', data => {
            io.emit('server message', {message: data.message, name: user.displayname});
        });

        socket.on('disconnect', function(){
            userList.removeByValue(user.displayname);
            io.emit('leave', userList);
        })
    });
};