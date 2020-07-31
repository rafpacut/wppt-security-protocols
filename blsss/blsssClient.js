var Signer = require('./Signer.js');
const utils = require('../utils.js');

class BlssClient{
    constructor(rp_wrapper){
        this.rp_wrapper = rp_wrapper;
        this.signer = new Signer();
        this.basePath='/protocols/blsss';
        this.protocol_name = "blsss";
        this.session_token;
    }

    init(){
        let A = this.signer.publicKey;
        let m = "trolololo";
        let sigma = this.signer.sign(m);

        let path = this.basePath+'/verify';
        var options = {
            method : 'POST',
            uri: `${hostname}:${port}${path}`,
            body: {
                protocol_name : this.protocol_name,
                payload : {
                    sigma: utils.encode(sigma),
                    A: utils.encode(A),
                    msg: m
                }
            },
            json: true
        }
        this.rp_wrapper.send(options)
        .then(res=>{
            console.log(res);
        });
    }
}

module.exports = BlssClient;