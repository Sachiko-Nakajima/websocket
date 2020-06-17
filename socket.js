var express = require('express');
var app = express();
//var ws = require('./ws');
var http = require('http').createServer(app);
var io = require('socket.io')(http); 
app.use(express.static('public'));

http.listen(8000,() => {
    console.log('listening on *:8000');
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

    function mouseMsg(data){
        socket.broadcast.emit('mouse', data);
        console.log(data);
    }
}

