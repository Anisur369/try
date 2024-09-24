const handle = {}
handle.notFound=(requestProperties,callback)=>{
    callback(200,{
        message: 'page in not Found'
    })
}

module.exports=handle;