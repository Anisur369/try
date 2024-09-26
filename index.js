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
const environments = require('./helpers/environments');
const data = require('./lib/data');

// data.create('test','newFile',{'name': 'Bangladesh','language': 'Bangla','color':'green'},(err)=>{
//     if(!err){
//         console.log('File created successfully');
//     }else{
//         console.log('Error in creating file:-',err);
//     }
// });

// data.read('test','newFile',(err,data)=>{
//     if(!err){
//         console.log(data);
//     }else{
//         console.log('Error in creating file:-',err);
//     }
// });

// data.update('test','newFile', {'name': 'Bangladesh','lang':'en'},(err,result)=>{
//     if(!err){
//         console.log('result');
//     }else{
//         console.log('Error in creating file:-',err);
//     }
// });

// data.delete('test','newFile', (err) => {
//     if(!err){
//         console.log('File deleted successfully');
//     }else{
//         console.log('Error in deleting file:-',err);
//     }
// })

let app = {};
// Create the server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environments.port,() => {



        
        console.log(`Server is running on port http://localhost:${environments.port}`);
    });
}

// Request and response handlers
app.handleReqRes = handleReqRes;



app.createServer();