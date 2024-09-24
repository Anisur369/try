/*
*Title:Handle Request Response
*Description: Handle Resquest and response
*Author: Anisur Rahman (Learn with Anis)
*Date:09/12/24
*
*/
//Dependencies
const url = require('url');
const {StringDecoder} = require('string_decoder');
const routers = require('../lib/routers');
const {notFound} = require('../lib/routers/notFound');

//modue scaffolding
const handler={};

handler.handleReqRes = (req,res) => {
    const parseUrl = url.parse(req.url, true);
    const path = parseUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\?+$/g,'');
    const method = req.method.toLowerCase();
    const queryString = parseUrl.query;
    const query = req.query;
    const headers = req.headers;

    const requestProperties = {
        parseUrl,
        path,
        trimmedPath,
        method,
        queryString,
        query,
        headers,
        statusCode: 200,
        message: 'success'
    };

    const chosenHandler = routers[trimmedPath] ? routers[trimmedPath] :notFound;

    const decoder =new StringDecoder('utf8');

    let realData = '';
    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    })
    req.on('end', () => {
        realData+=decoder.end();
        requestProperties.body = realData;
        console.log(requestProperties.body)
        
        chosenHandler(requestProperties,(statusCode, payload)=> {
            statusCode = typeof(statusCode) === 'number' ? statusCode : 500;
            payload = typeof(payload) === 'object' ? payload : {};            
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payload.message);
        })
    });
    
};

module.exports = handler;