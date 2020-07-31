let rp = require('request-promise');
let appCrypto = require('./appCrypto.js');
let utils = require('./utils.js');

class Rp_wrapper{
    constructor(encryptionMode){
        this.encryptionMode = encryptionMode;
    }

    send(options){
		return new Promise((resolve, reject)=>{
			if(this.encryptionMode == 'none'){
				resolve(rp(options));
			}
			else{
				options.body = utils.encryptReqBody(options.body, this.encryptionMode);
				options.uri = this.insertEncryptionURI(options.uri);
				resolve(rp(options)
				.then(res=>{
					res = appCrypto.decrypt(res, this.encryptionMode);
					return res;
				}));
			}
		});
	}
	
	insertEncryptionURI(uri){
		let i = uri.indexOf("protocols");
		if(i == -1){
			throw "In creating URI for encrypted payload: 'protocols' not found";
		}
		return `${uri.slice(0,i)}${this.encryptionMode}/${uri.slice(i)}`;
	}
}

module.exports = Rp_wrapper;