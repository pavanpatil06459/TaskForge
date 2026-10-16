const http = require('http'); //import
const app = require('./app');

http.createServer(app).listen(3000);