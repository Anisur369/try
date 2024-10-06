const fs=require('fs');
const path=require('path');
const lib={};

// eslint-disable-next-line no-undef
lib.basedir=path.join(__dirname,'/../.data/');

// write data to file
lib.create = (dir, file, data, callback) => {
    fs.open(lib.basedir+dir+'/'+file+'.json','wx',(err, fileDescriptor) => {
        if(!err && fileDescriptor) {
            const jsonString = JSON.stringify(data);
            fs.writeFile(fileDescriptor, jsonString, (err2) => {
                if(!err2) {
                    fs.close(fileDescriptor, (err3) => {
                        if(!err3) {
                            callback(false);
                        } else {
                            callback('Error closing the file');
                        }
                    });
                } else {
                    callback('Error writing to the file');
                }
            });
        }else{
            callback('Error creating new file, it may already exist');
        }
    })
};

// read data from the file
lib.read = (dir, file, callback) => {
    fs.readFile(lib.basedir+dir+'/'+file+'.json','utf8',(err, data) => {
        if(!err && data) {
            const parsedData = JSON.parse(data);
            callback(false, parsedData);
        } else {
            callback(err, data);
        }
    });

}

// update data in the file
lib.update = (dir, file, data, callback) => {
    //const filePath = path.join(lib.basedir, dir, `${file}.json`);    
    fs.open(lib.basedir+dir+'/'+file+'.json', 'r+', (err, fileDescriptor) => {
        if (err || !fileDescriptor) {
            return callback('Error opening the file for updating');
        }
        const jsonString = JSON.stringify(data);
        fs.ftruncate(fileDescriptor, (err1) => {
            if(!err1) {
                fs.write(fileDescriptor, jsonString, (err2) => {
                    if(!err2) {
                        fs.close(fileDescriptor, (err3) => {
                            if(!err3) {
                                callback(false);
                            } else {
                                callback('Error closing the file');
                            }
                        });
                    } else {
                        callback('Error writing to the file');
                    }
                });
            }else{
                callback('Error updating truncating the file may not exist');
            }
        });
    });
};


// delete existing data file
lib.delete = (dir, file, callback) => {
    fs.unlink(lib.basedir+dir+'/'+file+'.json', (err) => {
        if(!err) {
            callback(false);
        } else {
            callback('Error deleting the file');
        }
    });
};

lib.list=(dir,callback)=>{
    fs.readdir(lib.basedir+dir, (err,fileNames) => {
        if(!err && fileNames && fileNames.length > 0){
            const trimmedFiles = [];
            fileNames.forEach(fileName=>{
                trimmedFiles.push(fileName.replace('.json',''))
            });
            callback(false,trimmedFiles)
        } else{
            callback('error reading directory')
        }
    })
}




// export the module
module.exports = lib;