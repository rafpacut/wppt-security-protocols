const naxos = require('./naxos.js');
const mcl = require('mcl-wasm')
const crypto = require('crypto')


class Responder{
    constructor(){
        this.y = new mcl.Fr();
        this.y.setByCSPRNG();

        this.g = new mcl.G1();
        this.g.setStr("1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569", 10);

        this.b = new mcl.Fr();
        this.b.setByCSPRNG();

        this.B = mcl.mul(this.g, this.b)
    }

    genEphKey(){
        this.Y = naxos.genEphKey(this.y, this.b, this.g);
        return this.Y;
    }

    genSessionKey(X, A){
        this.sessionKey = naxos.genSessionKeyResponder(this.b, X, this.B, A, this.y);
        console.log(this.sessionKey.toString('base64'))
    }

    createCheckMsg(msg){
        const hash = crypto.createHash('SHA3-512')
        hash.update(this.sessionKey);
        hash.update(msg);
        const digest = hash.digest()

        return Buffer.from(digest).toString('base64')
    }
}

module.exports = Responder;