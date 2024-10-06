/*
*Title:Sample Handler
*Description: Sample Handler
*Author: Anisur Rahman (Learn with Anis)
*Date:09/12/24
*
*/ 
//module scaffolding
const handle={};

handle.homePage = (requestProperties,callback) => {
    callback(200,{
        message: "Welcome to Home Page"
    })
};

module.exports = handle;