/*
*Title:Uptime Monitoring Application
*Description: A RESTFul API to monitor up or down time of user defined links
*Author: Anisur Rahman (Learn with Anis)
*Date:09/12/24
*
*/
//Dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes');

// Define the server configuration
const app = {};

// Create the server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(3000,() => {
        console.log('Server is running on port http://localhost:3000');
    });
}

// Request and response handlers
app.handleReqRes = handleReqRes;



app.createServer();