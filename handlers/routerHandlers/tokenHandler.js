/*
*Title: Token Handler
*Description: Handler to handle token related routes
*Author: Anisur Rahman (Learn with Anis)
*Date:09/26/24
*
*/
//dependencies
const data = require('../../lib/data'); 
const {hash, createRandomString} = require('../../helpers/utilities');
//module scaffolding
const handler={};

handler.tokenHandler = (requestProperties, callback) => {    
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback);
    }else {
        callback(405);
    }
};


// _user method handler for request
handler._token = {
    get: (requestProperties, callback) => {
        const id = typeof(requestProperties.queryStringObject.id) ==='string' && requestProperties.queryStringObject.id.trim().length === 20? requestProperties.queryStringObject.id : false;
        if (id) {
            data.read('tokens', id, (err, tokenData)=>{
                const token = {...tokenData};
                if (!err && token) {
                    callback(200, token);
                } else {
                    callback(404,{
                        'error':"Invalid token number"+err,
                    });
                }
            });
        } else {
            callback(400, {
                message: 'Missing token required field'
            });
        }
    },

    post: (requestProperties, callback) => {
        const phone = typeof(requestProperties.body.phone) ==='string' && requestProperties.body.phone.trim().length === 11? requestProperties.body.phone : false;
        const password = typeof(requestProperties.body.password) ==='string' && requestProperties.body.password.trim().length > 0? requestProperties.body.password : false;
        
        if (phone && password) {
            data.list('users',(err,fData) => {
                if(!err && fData && fData.includes(phone)){
                    data.read('users', phone, (err1, userData) => {
                        const hashedpassword = hash(password);
                        if(hashedpassword === userData.password && phone === userData.phone) {
                            let tokenId = createRandomString(20);
                            const expires = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days;
                            const tokenObject = {
                                phone,
                                id: tokenId,
                                expires
                            };
                            data.create('tokens', tokenId, tokenObject, (err2) => {
                                if(!err2) {
                                    callback(200, tokenObject);
                                } else {
                                    callback(500, {
                                        message: 'Could not create token'
                                    });
                                }
                            })                
                        }else {
                            callback(403, {
                                message: 'Incorrect password'
                            });
                        }

                    })                    
                    
                }else{
                    callback(403, {
                        'error':"Invalid phone number"
                    });
                }
            })

        }else {
            callback(400, {
                message: 'Missing required field'
            });
        }
    },
    put: (requestProperties, callback) => {
        const id = typeof(requestProperties.body.id) ==='string' && requestProperties.body.id.trim().length === 20? requestProperties.body.id : false;
        const extend = typeof(requestProperties.body.extend) === 'boolean' && requestProperties.body.extend === true? true : false;
        
        if (id && extend) {
            data.read('tokens', id, (err, tokenData) => {
                if (!err && tokenData) {
                    if (tokenData.expires > Date.now()) {
                        tokenData.expires = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days;
                        data.update('tokens', id, tokenData, (err2) => {
                            if (!err2) {
                                callback(200, {
                                     message: 'Token has been extended successfully'
                                });
                            } else {
                                callback(500, {
                                    message: 'Could not extend token expiration'
                                });
                            }
                        });
                    } else {
                        callback(400, {
                            message: 'Token has already expired'
                        });
                    }
                } else {
                    callback(404, {
                        message: 'Token not found'
                    });
                }
            });            
        }else {
            callback(400, {
                message: 'Missing required field'
            });
        }
    },
    delete: (requestProperties, callback) => {
        const id = typeof(requestProperties.queryStringObject.id) ==='string' && requestProperties.queryStringObject.id.trim().length === 20? requestProperties.queryStringObject.id : false;
        if (id) {
            data.read('tokens', id, (err, tokenData) => {
                if (!err && tokenData) {
                    data.delete('tokens', id, (err2) => {
                        if (!err2) {
                            callback(200, {
                                message: 'Token deleted successfully'
                            });
                        } else {
                            callback(500, {
                                message: 'Could not delete token'
                            });
                        }
                    });
                } else {
                    callback(404, {
                        message: 'Token not found'
                    });
                }
            });            
        } else {
            callback(400, {
                message: 'Missing required field'
            });
        }
    },
    verify: (id, phone, callback) => {
        data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                if (tokenData.phone === phone && tokenData.expires > Date.now()) {
                    callback(true);
                } else {
                    callback(false);
                }
            } else {
                callback(false);
            }
        });
    }        
}



module.exports = handler;