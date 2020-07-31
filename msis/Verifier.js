const mcl = require("mcl-wasm");


class Verifier {
    constructor(publicKey){
        this.publicKey = publicKey;
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
        let exp = mcl.add(mcl.mul(this.publicKey, this.c), this.X);

        let g2 = mcl.hashAndMapToG2(this.X.getStr(10).slice(2) + this.c.getStr(10));

        let lhs = mcl.pairing(this.g, s);
        let rhs = mcl.pairing(exp, g2);

        return lhs.isEqual(rhs);
    }
}

module.exports = Verifier;