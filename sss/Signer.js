const mcl = require("mcl-wasm");
const hash = require("./sssUtil.js");

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
        let x = new mcl.Fr();
        x.setByCSPRNG();

        let X = mcl.mul(this.g, x);

        let h = hash.hash(`${m}${X.getStr().slice(2)}`);
        let c = new mcl.Fr();
        c.setStr(h);


        let s = new mcl.Fr();
        s = mcl.add(x, mcl.mul(this.secretKey, c));
        return [s, X];
    }
}

module.exports = Signer;