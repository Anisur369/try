/*
*Title:Uptime Monitoring Application
*Description: A RESTFul API to monitor up or down time of user defined links
*Author: Anisur Rahman (Learn with Anis)
*Date:09/12/24
*
*/
//Dependencies
const http=require('http');

const {handleReqRes}=require('./helpers/handleReqRes');
const environment=require('./helpers/environments');
const data = require('./lib/data');


const app = {};



app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`listening to port http://localhost:${environment.port}`);
    });
};



//handle Request Response
app.handleReqRes=handleReqRes;


//start the server
app.createServer();