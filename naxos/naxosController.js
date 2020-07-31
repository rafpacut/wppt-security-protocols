const Responder = require('./Responder.js');
const utils = require('../utils.js');

class NaxosController{
    constructor(){
        this.responder = new Responder();
    }

    handlePkey(res){
        const resBody = {
            B : utils.encode(this.responder.B)
        }
        //console.log(`B: ${this.responder.B.getStr()}`)
        res.locals.conWrapper.send(res, resBody);
    }

    handleExchange(req, res){
        let [X, A, msg] = this.unpackPayload(req);

        const Y = this.responder.genEphKey();
        this.responder.genSessionKey(X, A);
        const checkMsg = this.responder.createCheckMsg(msg);

        const resBody = {
            payload : {
                Y : utils.encode(Y),
                msg : checkMsg
            }
        }
        res.locals.conWrapper.send(res, resBody);
    }

    unpackPayload(req){
        let X = new mcl.G1();
        X.setStr(utils.decode(req.body.payload.X));

        let A = new mcl.G1();
        A.setStr(utils.decode(req.body.payload.A));

        const msg = req.body.payload.msg;

        return [X, A, msg]
    }

}

module.exports = NaxosController;