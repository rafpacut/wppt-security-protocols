const mcl = require("mcl-wasm");

class Signer
{
    constructor()
    {
        this.secretKey = new mcl.Fr();
        this.secretKey.setByCSPRNG();

        this.g = new mcl.G1();
        this.g.setStr("1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569", 10);

        this.publicKey = mcl.mul(this.g, this.secretKey);
    }

    sign(m)
    {
        let h = mcl.hashAndMapToG2(m)
        return mcl.mul(h, this.secretKey);
    }
}

module.exports = Signer;