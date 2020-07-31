var Signer = require('./Signer.js');
const utils = require('../utils.js');

class SssClient{
    constructor(rp_wrapper){
        this.rp_wrapper = rp_wrapper;
        this.signer = new Signer();
        this.basePath='/protocols/sss';
        this.protocol_name = "sss";
        this.session_token;
    }

    init(){
        let A = this.signer.publicKey;
        let m = "trolololo";
        let [s, X] = this.signer.sign(m);

        let path = this.basePath+'/verify';
        var options = {
            method : 'POST',
            uri: `${hostname}:${port}${path}`,
            body: {
                protocol_name : this.protocol_name,
                payload : {
                    s: s.getStr(),
                    X: utils.encode(X),
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

module.exports = SssClient;