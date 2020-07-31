const mcl = require("mcl-wasm");
class Prover {
    constructor(){ 
        this.sk1 = new mcl.Fr();
        this.sk1.setByCSPRNG();

        this.sk2 = new mcl.Fr();
        this.sk2.setByCSPRNG();

        this.g1 = new mcl.G1();
        this.g1.setStr("1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569", 10);

        this.g2 = new mcl.G1();
        this.g2.setStr("1 2144250947445192081071618466765046647019257686245947349033844530891338159027816696711238671324221321317530545114427 2665798332422762660334686159210698639947668680862640755137811598895238932478193747736307724249253853210778728799013", 10);

        this.pk = mcl.add(mcl.mul(this.g1, this.sk1), mcl.mul(this.g2, this.sk2));
    }

    createCommitment(){
        this.x1 = new mcl.Fr();
        this.x1.setByCSPRNG();

        this.x2 = new mcl.Fr();
        this.x2.setByCSPRNG();

        var X1 = new mcl.G1();
        X1 = mcl.mul(this.g1, this.x1); 

        var X2 = new mcl.G2();
        X2 = mcl.mul(this.g2, this.x2); 

        return mcl.add(X1, X2);
    }

    consumeC(c){
        this.c = c;
    }

    createProof(){
        var s1 = mcl.add(mcl.mul(this.sk1, this.c), this.x1); 
        var s2 = mcl.add(mcl.mul(this.sk2, this.c), this.x2);
        return [s1,s2];
    }
}

module.exports = Prover;