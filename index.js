const http = require('http');
http.createServer((request, response) => {
    response.end('Hello NodeJS')
}).listen(3000, "127.0.0.1", function(){
    console.log("Start see 3000 port")

});

