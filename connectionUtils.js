function readConConfig(fileName){
    const fs = require('fs')
    try {
        const data = fs.readFileSync(`./${fileName}`, 'utf-8');
        return data.split("\n").slice(0,2)
    }
    catch(err){
        throw err;
    }
}

module.exports.readConConfig = readConConfig;