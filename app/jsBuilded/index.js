"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Routes_1 = require("./routes/Routes");
var port = 80;
new Routes_1.default().express.listen(port, function (err) {
    if (err) {
        return console.log(err);
    }
    return console.log("server is listening on " + port);
});
