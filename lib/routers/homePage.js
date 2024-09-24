const handle = {}
handle.homePage=(requestProperties,callback)=>{
    callback(200,{
        message: '<h1>Welcome to the home page</h1>'
    })
}

module.exports=handle;