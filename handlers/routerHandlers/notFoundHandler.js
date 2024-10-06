/*
*Title:Not Found Handler
*Description: 404 Not Found Handler
*Author: Anisur Rahman (Learn with Anis)
*Date:09/12/24
*
*/
//module scaffolding
const handle={};

handle.notFoundHandler=(requestProperties,callback)=>{
    callback(404,{
        massage:'Your requested URL was not found'
    })
};

module.exports=handle;