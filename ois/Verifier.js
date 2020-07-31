mcl = require("mcl-wasm");

class Verifier {
    constructor(publicKey){
        this.pk = publicKey;
        this.g1 = new mcl.G1();
        this.g1.setStr("1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569", 10);
        this.g2 = new mcl.G1();
        this.g2.setStr("1 2144250947445192081071618466765046647019257686245947349033844530891338159027816696711238671324221321317530545114427 2665798332422762660334686159210698639947668680862640755137811598895238932478193747736307724249253853210778728799013", 10);
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

    verify(s1, s2){
        var lhs1 = mcl.mul(this.g1, s1);
        var lhs2 = mcl.mul(this.g2, s2);
        var lhs = mcl.add(lhs1, lhs2);

        var Ac = mcl.mul(this.pk, this.c);
        var rhs = mcl.add(this.X, Ac);
        return lhs.isEqual(rhs);
    }
}

module.exports = Verifier;