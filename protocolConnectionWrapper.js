const appCrypto = require("./appCrypto.js");
let utils = require('./utils.js');

class ProtocolConnectionWrapper {
    constructor(encMode){
        this.encryptionMode = encMode;
    }

    setEncryption(encMode){
        this.encryptionMode = encMode;
    }
    send(res, resBody){
        if(this.encryptionMode == 'none'){
            res.json(resBody);
        }
        else {
            let resBodyEnc = utils.encryptReqBody(resBody, this.encryptionMode);
            res.json(resBodyEnc);
        }
    }
}

module.exports = ProtocolConnectionWrapper;