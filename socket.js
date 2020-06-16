var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http); 
app.use(express.static('public'));

http.listen(3000,() => {
    console.log('listening on *:3000');
});

// app.get('/', (req,res) => {
// //    res.send('<h1>Hello world</h1>');
//     res.sendFile(__dirname + '/public/index.html');
// });

io.on('connection', newConnection);

function newConnection(socket){
    console.log('new connection: ' + socket.id);
//    socket.on('person', personMsg);
    socket.on('mouse', mouseMsg);

    function personMsg(data) {
        socket.broadcast.emit('person', data);
        console.log(data);
    }
    function mouseMsg(data){
        socket.broadcast.emit('mouse', data);
        console.log(data);
    }
}

