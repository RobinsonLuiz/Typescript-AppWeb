var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = {}; 

app.get('/', function(req, res){
  res.send('server is running');
});

app.post('/', function(req, res){
    res.send('server is running');
});

io.on("connection", function (client) {  
    client.on("join", function(name){
        console.log("Entrou: " + name);
        if (!clients[client.id])
            client.emit("update", "Você conectou no servidor");
        clients[client.id] = name;
        client.broadcast.emit("update", name + " entrou na conversa");
    });

    client.on("send", function(msg){
    	console.log("Mensagem: " + msg);
        client.broadcast.emit("chat", clients[client.id], msg);
    });

    client.on("disconnect", function(){
        console.log("Disconnect");
        if (clients[client.id] != undefined) {
            io.emit("update", clients[client.id] + " saiu do chat");
            delete clients[client.id];
        }
    });
});


http.listen(3000, function(){
  console.log('listening on port 3000');
});
