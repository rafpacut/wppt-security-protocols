mcl = require("mcl-wasm");

class Verifier {
    constructor(publicKey){
        this.pk = publicKey;
        this.g = new mcl.G1();
        this.g.setStr("1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569", 10);
    }

    consumeX(X){
        this.X = X;
    }

    createChallenge(){
        var c = new mcl.Fr();
        c.setByCSPRNG();
        this.c = c;

        return c;
    }

    verify(s){
        var Ac = mcl.mul(this.pk, this.c);
        var lhs = mcl.mul(this.g, s);
        var rhs = mcl.add(this.X, Ac);
        return lhs.isEqual(rhs);
    }
}

module.exports = Verifier;