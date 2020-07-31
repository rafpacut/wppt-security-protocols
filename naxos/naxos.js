const mcl = require('mcl-wasm');
const crypto = require('crypto');

class Naxos
{
    static genEphKey(ephSk, sk, g){
        const h = this.H1(ephSk, sk)

        let ephKey = new mcl.G1()
        ephKey = mcl.mul(g, h)
        return ephKey
    }

    static genSessionKeyInitiator(a, Y, A, B, x){
        let term1 = new mcl.G1();
        let term2 = new mcl.G1();
        let term3 = new mcl.G1();

        term1 = mcl.mul(Y, a)
        term2 = mcl.mul(B, this.H1(x, a))
        term3 = mcl.mul(Y, this.H1(x, a))
        return this.H2(term1, term2, term3, A, B)
    }

    static genSessionKeyResponder(b, X, B, A, y){
        let term1 = new mcl.G1();
        let term2 = new mcl.G1();
        let term3 = new mcl.G1();


        term1 = mcl.mul(A, this.H1(y, b))
        term2 = mcl.mul(X, b)
        term3 = mcl.mul(X, this.H1(y, b))
        return this.H2(term1, term2, term3, A, B)
    }

    static genEphSk(ephSkLen){
        return crypto.getRandomValues(ephSkLen)
    }

    static H1(val1, val2){
        const r = '0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001';
        const hash = crypto.createHash('SHA3-512')
        hash.update(val1.getStr().slice(2)+val2.getStr(10));
        const mHash = hash.digest('hex')

        const rInt = BigInt(r);
        const hashInt = BigInt('0x'+mHash);
        const valueStr = (hashInt % rInt).toString();

        let fr = new mcl.Fr()
        fr.setStr(valueStr)
        return fr;
    }

    static H2(a,b,c,d,e){
        const hash = crypto.createHash('SHA3-512')
        hash.update(a.getStr(10).slice(2))
        hash.update(b.getStr(10).slice(2))
        hash.update(c.getStr(10).slice(2))
        hash.update(d.getStr(10).slice(2))
        hash.update(e.getStr(10).slice(2))
        return hash.digest()
    }
}

module.exports = Naxos