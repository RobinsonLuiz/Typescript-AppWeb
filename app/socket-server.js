var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = {};
app.get('/', function (req, res) {
    res.send('server is running');
});

app.post('/', function (req, res) {
    res.send('server is running');
});

io.on("connection", function (client) {

    client.on("send", function (msg) {
        console.log("Mensagem: " + msg);
        client.broadcast.emit("chat", clients[client.id], msg);
    });

    client.on("join", function (usuario) {
        let user = JSON.parse(usuario);
        if (!clients[client.id]) {
            console.log("Entrou: " + user.nome);
            clients[client.id] = user;
            client.broadcast.emit("update", user.nome + " está online");
        }
    });

    client.on("disconnect", function () {
        console.log("Disconnect");
        if (clients[client.id] != undefined) {
            io.emit("update", clients[client.id].nome + " saiu do chat");
            delete clients[client.id];
        }
    });
});


http.listen(3000, function () {
    console.log('listening on port 3000');
});
