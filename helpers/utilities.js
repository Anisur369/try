/*
*Title:User Utilities
*Description: Important utilities for creating users functions
*Author: Anisur Rahman (Learn with Anis)
*Date:09/12/24
*
*/
//dependencies 
//module scaffolding
const crypto = require('crypto');
const environmentToExport = require('./environments');
//const config = require('./config');

// module scaffolding
const utilities = {};

// parse JSON string to Object
utilities.parseJSON = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString);
    } catch (err) {
        output = {};
        //console.error(`Error parsing JSON: ${err.message}`);
    };
    return output
};


utilities.hash = (string) => {
    if (typeof string === 'string' && string.length > 0) {
        const hash = crypto
            .createHash('sha256', environmentToExport.secretKey)
            .update(string)
            .digest('hex');
        return hash;
    }
};



utilities.createRandomString = (strlength) => {
    let length=typeof(strlength) === 'number' ? strlength : false;
    if(length) {
        let possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
        for (let i = 0; i < length; i++) {
            randomString += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));            
        };
        return randomString;
    }else {
        return false;
    }    
    
};

//export module
module.exports = utilities;
