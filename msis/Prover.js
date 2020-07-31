const mcl = require("mcl-wasm");

class Prover {
    constructor(){
        this.secretKey = new mcl.Fr();
        this.secretKey.setByCSPRNG();

        this.g = new mcl.G1();
        this.g.setStr("1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569", 10);
        this.publicKey = mcl.mul(this.g, this.secretKey);
    }

    createCommitment(){
        this.x = new mcl.Fr();
        this.x.setByCSPRNG();

        this.X = new mcl.G1();
        this.X = mcl.mul(this.g, this.x); 

        return this.X;
    }

    consumeC(c){
        this.c = c;
    }

    createProof(){
        const g2 = mcl.hashAndMapToG2(this.X.getStr(10).slice(2) + this.c.getStr(10));
        const exp =  mcl.add(mcl.mul(this.secretKey, this.c), this.x);
        return mcl.mul(g2, exp);
    }
}

module.exports = Prover;