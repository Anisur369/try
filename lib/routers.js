const { homePage } = require('./routers/homePage');
const {samplePage} = require('./routers/samplePage');
const {userHandler} = require('./routers/userHandler');
const {tokenHandler} = require('./routers/tokenHandler');
const routers = {
    '' : homePage,
    sample : samplePage,
    user : userHandler,
    token: tokenHandler,
}

module.exports = routers;