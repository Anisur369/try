const fs = require('fs');
const path = require('path');

const lib = {};

lib.basedir = path.join(__dirname, '../.data/');

lib.create = (dir, file, data, callback) => {
    fs.open(lib.basedir+dir+'/'+file+".json", 'wx', (err, userData) => {        
        if (!err && userData){
            const stringData = JSON.stringify(data);                        
            fs.writeFile(userData, stringData, (err2) => {
                if (!err2){
                    fs.close(userData, (err3) => {
                        if (!err3){
                            callback(false);
                        } else {
                            callback('Error closing the file');
                        }
                    });
                } else {
                    callback('Error writing to the file');
                }
            });
        }else {
            callback('Could not create the file, it already exists!');
        }
    })
};

lib.read = (dir, file, callback) => {
    fs.readFile(lib.basedir+dir+'/'+file+".json", 'utf8', (err, data) => {
        if (!err && data){
            const parsedData = JSON.parse(data);
            callback(false, parsedData);
        } else {
            callback('Error reading the file or file not found!');
        }
    })
}

lib.update = (dir, file, data, callback) => {
    fs.open(lib.basedir+dir+'/'+file+".json", 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor){
            const stringData = JSON.stringify(data);                        
            fs.ftruncate(fileDescriptor, (err2) => {
                if (!err2){
                    fs.writeFile(fileDescriptor, stringData, (err3) => {
                        if (!err3){
                            fs.close(fileDescriptor, (err4) => {
                                if (!err4){
                                    callback(false);
                                } else {
                                    callback('Error closing the file');
                                }
                            });
                        } else {
                            callback('Error writing to the file');
                        }
                    });
                } else {
                    callback('Error truncating the file');
                }
            });
        } else {
            callback('Could not open the file for updating, it may not exist!');
        }
    })
};


lib.delete = (dir, file, callback) => {
    fs.unlink(lib.basedir+dir+'/'+file+".json", (err) => {
        if (!err){
            callback(false);
        } else {
            callback('Error deleting the file');
        }
    })
};


module.exports=lib;



