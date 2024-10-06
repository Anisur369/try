/*
*Title:Sample Handler
*Description: Sample Handler
*Author: Anisur Rahman (Learn with Anis)
*Date:09/12/24
*
*/ 
//module scaffolding
const handle={};

handle.sampleHandler=(requestProperties,callback)=>{
    callback(200,{
        massage:'This is a sample url'
    })
};

module.exports=handle;