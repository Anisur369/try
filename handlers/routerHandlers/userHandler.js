/*
*Title:User Handler
*Description: Handler to handler user related routes for user
*Author: Anisur Rahman (Learn with Anis)
*Date:09/12/24
*
*/
//dependencies
const data = require('../../lib/data'); 
const {hash} = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');
//module scaffolding
const handler={};

handler.userHandler = (requestProperties, callback) => {    
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._user[requestProperties.method](requestProperties, callback);
    }else {
        callback(405);
    }
};


// _user method handler for request
handler._user = {
    get: (requestProperties, callback) => {
        const phone = typeof(requestProperties.queryStringObject.phone) ==='string' && requestProperties.queryStringObject.phone.trim().length === 11? requestProperties.queryStringObject.phone : false;
        if (phone) {
            const token = typeof(requestProperties.headersObject.token) ==='string' && requestProperties.headersObject.token.trim().length === 20? requestProperties.headersObject.token : false ;

            tokenHandler._token.verify(token, phone, (tokenData)=> {
                if(tokenData) {
                    data.read('users', phone, (err, data)=>{
                        const user = {...data};
                        if (!err && user) {
                            delete user.password;
                            callback(200, user);
                        } else {
                            callback(404,{
                                'error':"Invalid phone number"
                            });
                        }
                    });
                } else {
                    callback(403, {
                        'error':"Missing or invalid token "
                    });
                }
            })
        } else {
            callback(400, {
                message: 'Missing required field'
            });
        }
    },
    post: (requestProperties, callback) => {
        const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
        const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0? requestProperties.body.lastName : false;        
        const phone = typeof(requestProperties.body.phone) ==='string' && requestProperties.body.phone.trim().length === 11? requestProperties.body.phone : false;
        const email = typeof(requestProperties.body.email) ==='string' && requestProperties.body.email.trim().length > 0 ? requestProperties.body.email : false;     
        const password = typeof(requestProperties.body.password) ==='string' && requestProperties.body.password.trim().length > 0? requestProperties.body.password : false;
        const tosAgreement = typeof(requestProperties.body.tosAgreement) === 'boolean' && requestProperties.body.tosAgreement === true? requestProperties.body.tosAgreement : false;
        
        if (firstName && lastName && phone && email && password && tosAgreement) {
                    data.read('users', phone, (err)=>{                        
                        if(err) {
                            const userData = {
                                firstName:firstName,
                                lastName:lastName,
                                phone:phone,
                                email:email,
                                password: hash(password),
                                tosAgreement:tosAgreement
                            };
                            data.create('users', phone, userData, (err,data)=>{
                                if(!err){
                                    callback(200, {
                                        message: 'User created successfully',
                                    });
                                } else{
                                    callback(500, {
                                        error: 'Could not create user'
                                    });
                                }
                            });
                        } else {
                            callback(404, {
                                message: 'exite User not found'
                            });
                        }
                    });
        }else {
            callback(400, {
                message: 'Place your valid information'
            });
        }
        
    },
    put: (requestProperties, callback) => {
        const phone = typeof(requestProperties.body.phone) ==='string' && requestProperties.body.phone.trim().length === 11? requestProperties.body.phone : false;
        const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
        const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0? requestProperties.body.lastName : false;
        const email = typeof(requestProperties.body.email) ==='string' && requestProperties.body.email.trim().length > 0 ? requestProperties.body.email : false;     
        const password = typeof(requestProperties.body.password) ==='string' && requestProperties.body.password.trim().length > 0? requestProperties.body.password : false;
        if(phone) {
            if(firstName || lastName || email || password || phone) {
                const token = typeof(requestProperties.headersObject.token) ==='string' && requestProperties.headersObject.token.trim().length === 20? requestProperties.headersObject.token : false ;

                tokenHandler._token.verify(token, phone, (tokenData)=> {
                    if(tokenData) {
                           data.read('users', phone, (err, userData)=>{
                                if(!err && userData){
                                    if(firstName) userData.firstName = firstName;
                                    if(lastName) userData.lastName = lastName;
                                    if(email) userData.email = email;
                                    if(password) userData.password = hash(password);
                                    if(phone) userData.phone = phone;
                                    data.update('users', phone, userData, (err)=>{
                                        if(!err) {
                                            callback(200, {
                                                "message":"User was updated successfully",
                                            });
                                        } else {
                                            callback(500, {
                                                error: 'Could not update user'
                                            });
                                        }
                                    });
                                }else {
                                    callback(404, {
                                        message: 'User not found'
                                    });
                                }
                            });                     

                    } else {
                        callback(403, {
                            'error':"Missing or invalid token "
                        });
                    }
                })
            } 
        }else {
            callback(400, {
                message: 'Missing required field'
            });
        }
    },
    delete: (requestProperties, callback) => {
        const phone = typeof(requestProperties.queryStringObject.phone) ==='string' && requestProperties.queryStringObject.phone.trim().length === 11? requestProperties.queryStringObject.phone : false;
        if(phone) {
            const token = typeof(requestProperties.headersObject.token) ==='string' && requestProperties.headersObject.token.trim().length === 20? requestProperties.headersObject.token : false ;

            tokenHandler._token.verify(token, phone, (tokenData)=> {
                if(tokenData) {
                    data.read('users', phone, (err, userData)=>{
                        if(!err && userData) {
                            data.delete('users', phone, (err)=>{
                                if(!err) {
                                    callback(200, {
                                        message: 'User deleted successfully',
                                    });
                                } else {
                                    callback(500, {
                                        error: 'Could not delete user'
                                    });
                                }
                            });
                        } else {
                            callback(404, {
                                message: 'User not found'
                            });
                        }
                    })
                    
                } else {
                    callback(403, {
                        'error':"Missing or invalid token "
                    });
                }
            })

        }else{
            callback(400, {
                message: 'Missing required field'
            });
        }
    }        
}

module.exports = handler;