const crypto = require('crypto');
const environments = require('./environments');
const utilities = {};


utilities.parseJSON = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString);
    } catch (err) {
        output = {};
    }
    return output;
};

utilities.hash = (str) => {
    if(typeof(str) === 'string' && str.length > 0) {
        const hash = crypto.createHmac('sha256', environments.secretKey).update(str).digest('hex');
        
        //const hash = crypto.createHash('sha256', 'lsdkf').update(str).digest('hex');
        return hash;
        console.log(environments[process.env.NODE_ENV])
    };
};

module.exports = utilities;