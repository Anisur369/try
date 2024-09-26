const {hash, parseJSON} = require('../../helpers/utilities');
const handler = {};
const data = require('../data');
handler.tokenHandler=(requestProperties,callback)=>{
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if(acceptedMethods.indexOf(requestProperties.method) > -1){
        handler._user[requestProperties.method](requestProperties,callback);
    }else {
        callback(405, {'Error': 'Method not allowed'});
    }
};


handler._user = {
    post: (requestProperties, callback)=>{
        const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false ;
        const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false ;

        const userName = typeof(requestProperties.body.userName) === 'string' && requestProperties.body.userName.trim().length >= 4 && requestProperties.body.userName===requestProperties.body.userName.toLowerCase() ? requestProperties.body.userName : false ;

        const email = typeof(requestProperties.body.email) === 'string' && requestProperties.body.email.trim().length > 0 && requestProperties.body.email.includes("@gmail.com")? requestProperties.body.email : false ;
        const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false ;
        const phoneNumber = typeof(requestProperties.body.phoneNumber) === 'string' && requestProperties.body.phoneNumber.length === 11 ? requestProperties.body.phoneNumber : false ;
        const address = typeof(requestProperties.body.address) === 'string' && requestProperties.body.address.trim().length > 0? requestProperties.body.address : false ;
        const tosAgreement = typeof(requestProperties.body.tosAgreement) === 'boolean' && requestProperties.body.tosAgreement === true ? true : false ;

        if(firstName && lastName && email && password && phoneNumber && address && tosAgreement){
            // Hash the password
            //const hashedPassword = bcrypt.hashSync(password, 10);
            
            // Create the user object
            data.read('user', userName, (err, userData) => {
                if(err){
                    const userObject = {
                        firstName,
                        lastName,
                        userName,
                        email,
                        password:hash(password),
                        phoneNumber,
                        address,
                        tosAgreement
                    };
                    
                    // Store the user
                    data.create('users', userName, userObject, (err) => {
                        if(!err){
                            callback(200, {'Message': 'User created successfully'});
                        } else {
                            callback(500, {'Error': 'Could not create user , it user already exists!'});
                        }
                    });
                } else {
                    callback(400, {'Error': 'User already exists'});
                }
            })
            
        } else {
            callback(400, {'Error': 'Missing required fields or invalid data type'});
        }
    },
    get: (requestProperties,callback) => {
        const userName = typeof(requestProperties.queryString.userName) ==='string' && requestProperties.queryString.userName.trim().length > 0? requestProperties.queryString.userName : false ;
        
        if(userName){
            // Lookup the user
            data.read('users', userName, (err, user) => {
                let data = {...user};
                if(!err && data){
                    delete data.password
                    callback(200, data);
                } else {
                    callback(404, {'Error': 'User not found'});
                }
            });
        }
        console.log(requestProperties.body.userName)
    },
    put: (requestProperties, callback) => {
        const userName = typeof(requestProperties.body.userName) ==='string' && requestProperties.body.userName.trim().length > 0? requestProperties.body.userName : false ;
        const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false ;
        const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false ;
        const email = typeof(requestProperties.body.email) === 'string' && requestProperties.body.email.trim().length > 0 && requestProperties.body.email.includes("@gmail.com")? requestProperties.body.email : false ;
        const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false ;
        const phoneNumber = typeof(requestProperties.body.phoneNumber) === 'string' && requestProperties.body.phoneNumber.length === 11 ? requestProperties.body.phoneNumber : false ;
        const address = typeof(requestProperties.body.address) === 'string' && requestProperties.body.address.trim().length > 0? requestProperties.body.address : false ;
        
        if(userName){
            if(userName || firstName || lastName || email || phoneNumber || address){
                // Lookup the user
                data.read('users', userName, (err, uData) => {
                    const userData = {...uData}
                    if(!err && userData){
                        if(firstName) userData.firstName = firstName;
                        if(lastName) userData.lastName = lastName;
                        if(email) userData.email = email;
                        if(password) userData.password = hash(password);
                        if(phoneNumber) userData.phoneNumber = phoneNumber;
                        if(address) userData.address = address;
                        
                        // Store the updated user
                        data.update('users', userName, userData, (err) => {
                            if(!err){
                                callback(200, {'Message': 'User updated successfully'});
                            } else {
                                callback(500, {'Error': 'Could not update user'});
                            }
                        });                        
                    }else{
                        callback(404, {'Error': 'User not found'});
                    }
                })
            }else{
                callback(400,{
                    'Error': 'Missing fields to update'
                })
            }
        }else{
            callback(400, {'Error': 'Missing invalid user required fields'});
        };
        
    },
    delete: (requestProperties, callback) => {
        const userName = typeof(requestProperties.queryString.userName) ==='string' && requestProperties.queryString.userName.trim().length > 0? requestProperties.queryString.userName : false ;

        if(userName){
            // Lookup the user
            data.read('users', userName, (err, userData) => {
                if(!err && userData){
                    // Delete the user
                    data.delete('users', userName, (err) => {
                        if(!err){
                            callback(200, {'Message': 'User deleted successfully'});
                        } else {
                            callback(500, {'Error': 'Could not delete user'});
                        }
                    });
                } else {
                    callback(404, {'Error': 'User not found'});
                }
            });
        } else {
            callback(400, {'Error': 'Missing required fields'});
        }
    }
    
};




module.exports=handler;