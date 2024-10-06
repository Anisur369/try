/*
*Title: Check Handler
*Description: Handler for checking the status of a user account for membership.
*Author: Anisur Rahman (Learn with Anis)
*Date:09/28/24
*
*/
//dependencies
const data = require('../../lib/data'); 
const {hash, createRandomString} = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');
const environments = require('../../helpers/environments');
//module scaffolding
const handler={};

handler.checkHandler = (requestProperties, callback) => {    
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._check[requestProperties.method](requestProperties, callback);
    }else {
        callback(405);
    }
};


// _user method handler for request
handler._check={};
handler._check.get=(requestProperties,callback)=>{
    const id = typeof(requestProperties.queryStringObject.id) ==='string' && requestProperties.queryStringObject.id.trim().length === 20? requestProperties.queryStringObject.id : false;
    if(id){
        data.read('checks', id,(err, checkData)=>{
            if(!err && checkData){
                const token = typeof(requestProperties.headersObject.token) ==='string' && requestProperties.headersObject.token.trim().length === 20? requestProperties.headersObject.token : false;
                tokenHandler._token.verify(token, checkData.userPhone,(tokenIsValid)=>{
                    if(tokenIsValid){
                        callback(200, checkData)
                    }else{
                        callback(403, {'Error':'Missing or invalid token'})
                    }
                })
            }else{
                callback(404, {'Error':'Check not found'})
            }
        })
    }else{
        callback(400, {'Error':'Missing required field'});
    }
};
handler._check.post=(requestProperties, callback) => {
        let protocol = typeof(requestProperties.body.protocol) === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

        let url = typeof(requestProperties.body.url) === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url :false;

        let method = typeof(requestProperties.body.method) === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;

        let successCodes = typeof(requestProperties.body.successCodes) === 'object' && requestProperties.body.successCodes instanceof Array ? requestProperties.body.successCodes : false;

        let timeoutSeconds = typeof(requestProperties.body.timeoutSeconds) === 'number' && requestProperties.body.timeoutSeconds % 1 === 0 && requestProperties.body.timeoutSeconds > 1 && requestProperties.body.timeoutSeconds < 5 ? requestProperties.body.timeoutSeconds : false;

        if(protocol && url && method && successCodes && timeoutSeconds){
            const token = typeof(requestProperties.headersObject.token) ==='string'? requestProperties.headersObject.token : false ;
            data.read('tokens', token, (err1, tokenData) => {
                if(!err1 && tokenData){       
                    let userPhone = tokenData.phone;
                    data.read('users', userPhone, (err2, userData) => {
                        if(!err2 && userData){
                            tokenHandler._token.verify(token,userPhone, (tokenIsValid)=>{
                                if(tokenIsValid){
                                    let userObject = userData;
                                    let userChecks = typeof(userObject.checks) === 'object' && userObject.checks instanceof Array ? userObject.checks : [];
                                    if(userChecks.length < environments.maxChecks){
                                        let checkId = createRandomString(20);
                                        let checkObject = {
                                            'id': checkId,
                                            'userPhone': userPhone,
                                            'method': method,
                                            'protocol': protocol,
                                            'url': url,
                                            'successCodes': successCodes,
                                            'timeoutSeconds': timeoutSeconds
                                        };
                                        data.create('checks', checkId, checkObject, (err3) => {
                                            if(!err3){
                                                 userObject.checks= userChecks;
                                                 userObject.checks.push(checkId);
                                                 data.update('users', userPhone, userObject, (err4) => {
                                                    if(!err4){
                                                         callback(200, {
                                                             'message': 'Check created successfully',
                                                             'checkId': checkId
                                                         }); 
                                                    }else {
                                                         callback(500, {
                                                             'error': 'Could not update the user with the new check'
                                                         });
                                                    }
                                                 }) 
                                            }else {
                                                 callback(500, {
                                                     'error': 'Could not create the check'
                                                 });
                                            }
                                        })
                                        // userChecks.push(check);
                                        // userObject.checks = userChecks;
                                        // data.update('users', userPhone, userObject, (err3) => {
                                        //     if(!err3){
                                        //         callback(200, {
                                        //             'message': 'Check created successfully',
                                        //             'checkId': checkId
                                        //         });
                                        //     }else {
                                        //         callback(500, {
                                        //             'error': 'Could not update the user with the new check'
                                        //         });
                                        //     }
                                        // });
                                    }else {
                                        callback(401, {
                                            'error': 'Userhas already reached max check limit!'
                                        });
                                    }
                                }else {
                                    callback(403, {
                                        'error': 'Token is not valid'
                                    });
                                }
                            })                            
                        }else {
                            callback(403, {
                                'error': 'User not found'
                            });
                        }
                    })       
                }else {
                    callback(403, {
                        'error': 'Missing or invalid token'
                    });
                }
            })
        }else {
            callback(400, {
                'error': 'Missing required fields, protocol, url, method, successCodes, and timeoutSeconds'
            });
        }
        
};
handler._check.delete=(requestProperties,callback)=>{
    const id = typeof(requestProperties.queryStringObject.id) ==='string' && requestProperties.queryStringObject.id.trim().length === 20? requestProperties.queryStringObject.id : false;
    if(id){
        data.read('checks', id,(err, checkData)=>{
            if(!err && checkData){
                const token = typeof(requestProperties.headersObject.token) ==='string' && requestProperties.headersObject.token.trim().length === 20? requestProperties.headersObject.token : false;
                tokenHandler._token.verify(token, checkData.userPhone,(tokenIsValid)=>{
                    if(tokenIsValid){
                        data.delete('checks', id,(err2)=>{
                            if(!err2){
                                data.read('users', checkData.userPhone,(err2,userData)=>{
                                    const userObject=userData;
                                    if(!err){
                                        const userChecks=typeof(userObject.checks) === 'object' && userObject.checks instanceof Array ? userObject.checks : [];
                                        const checkPosition=userChecks.indexOf(id)
                                        if(checkPosition > -1){
                                            userChecks.splice(checkPosition,1);
                                            userObject.checks = userChecks;

                                            data.update('users', userObject.phone, userObject, (err3)=>{
                                                    if(!err3){
                                                        callback(200, {'Message':'Check deleted successfully'})
                                                    }else{
                                                        callback(500, {'Error':'Failed to update user'})
                                                    }
                                                })
                                        }else{
                                            callback(400, {'Error':'Check not found in user\'s checks'})
                                        }
                                    }else{
                                        callback(500,
                                                {'Message':'Check data is emtry!'}
                                        )
                                    }
                                })
                            }else{
                                    callback(500, {'Error':'Failed to delete check'})
                            }
                        });
                    }else{
                        callback(403, {'Error':'Missing or invalid token'})
                    }
                })
            }else{
                callback(404, {'Error':'Check not found'})
            }
        })
    }else{
        callback(400, {'Error':'Missing required field'});
    }
};    
handler._check.put=(requestProperties,callback)=>{
    const id =typeof(requestProperties.body.id)=='string' && requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false ;
    const protocol=typeof(requestProperties.body.protocol) === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol)>-1 ? requestProperties.body.protocol :false;
    const url=typeof(requestProperties.body.url) === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url:false;
    const method=typeof(requestProperties.body.method) ==='string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method)>-1? requestProperties.body.method : false;
    const successCodes=typeof(requestProperties.body.successCodes)==="object" && requestProperties.body.successCodes instanceof Array ? requestProperties.body.successCodes : false;
    const timeoutSeconds=typeof(requestProperties.body.timeoutSeconds)==="number" && requestProperties.body.timeoutSeconds % 1 === 0 && requestProperties.body.timeoutSeconds >= 1 && requestProperties.body.timeoutSeconds <= 5? requestProperties.body.timeoutSeconds : false;
    if(id){
        if(protocol || url || method || successCodes || timeoutSeconds){
            data.read('checks', id, (err, checkData)=>{
                if(!err && checkData){
                    const token = typeof(requestProperties.headersObject.token) ==='string' && requestProperties.headersObject.token.trim().length === 20? requestProperties.headersObject.token : false;
                    tokenHandler._token.verify(token, checkData.userPhone,(tokenIsValid)=>{
                        if(tokenIsValid){
                            const userObject=checkData;
                            if(protocol) userObject.protocol=protocol;
                            if(url) userObject.url=url;
                            if(method) userObject.method=method;
                            if(successCodes) userObject.successCodes=successCodes;
                            if(timeoutSeconds) userObject.timeoutSeconds=timeoutSeconds;
                            data.update('checks', id, userObject, (err2)=>{
                                if(!err2){
                                    callback(200, {'Message':'Check updated successfully', userObject})
                                }else{
                                    callback(500, {'Error':'Failed to update check'})
                                }
                            })
                        }else{
                            callback(403, {'Error':'Missing or invalid token'})
                            return;
                        }
                    });
                }else{
                    callback(404, {'Error':'Check not found 404'})
                    return;
                }
            })
        }
    }else{
        callback(400, {'Error':'Missing required field'})
    }
}        


module.exports = handler;