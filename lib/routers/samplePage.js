const handle = {}
handle.samplePage=(requestProperties,callback)=>{
    callback(200,{
        message: 'sample page created successfully'
    })
}

module.exports=handle;