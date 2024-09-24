const { homePage } = require('./routers/homePage');
const {samplePage} = require('./routers/samplePage');
const routers = {
    '': homePage,
    'sample': samplePage
}

module.exports = routers;