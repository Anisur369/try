/*
*Title:Routes
*Description: Application Routes
*Author: Anisur Rahman (Learn with Anis)
*Date:09/12/24
*
*/
//Dependencies
const {sampleHandler}=require('./handlers/routerHandlers/sampleHandler');
const {homePage}=require('./handlers/routerHandlers/homePage');
const {userHandler}=require('./handlers/routerHandlers/userHandler');
const {tokenHandler}=require('./handlers/routerHandlers/tokenHandler');
const {checkHandler}=require('./handlers/routerHandlers/checkHandler');
const routes={    
    '': homePage,
    '/': homePage,
    home:homePage,
    sample:sampleHandler,
    user:userHandler,
    token: tokenHandler,
    check: checkHandler
};
module.exports=routes;


