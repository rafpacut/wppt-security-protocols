const mcl = require("mcl-wasm");
const hash = require("./sssUtil.js");

class Verifier
{
    constructor(A, g)
    {
        this.A = A;
        this.g = g;
    }

    verify(m, s, X)
    {
        //const hashInput = `${m}${X.getStr().slice(2)}`
        const hashInput = m+X.getStr().slice(2)
        //console.log(hashInput)
        var h = hash.hash(hashInput);
        var c = new mcl.Fr();
        c.setStr(h);


        var lhs = mcl.mul(this.g, s);

        var Ac = mcl.mul(this.A, c);
        var rhs = mcl.add(X, Ac);

        return lhs.isEqual(rhs);
    }
}

module.exports = Verifier;