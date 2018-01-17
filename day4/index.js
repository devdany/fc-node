var http = require('http');

http.createServer((req,res) => {
    res.writeHead(200, {'contentType' : 'text/plain'});
    res.write('hello nodejs');
    res.end();
}).listen(3000);