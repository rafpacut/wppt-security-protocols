const mcl = require('mcl-wasm');
const utils = require('./mcl_utils');

class Naxos {
    static gen_keys() {
        const a = new mcl.Fr();
        a.setByCSPRNG();
        const A = mcl.mul(utils.g1(), a);
        return [a, A];
    }

    static gen_ekey() {
        const sk = new mcl.Fr();
        sk.setByCSPRNG();
        return utils.serialize(sk);
    }

    static init(a) {
        const esk = this.gen_ekey();
        const x = utils.hash1([esk, utils.serialize(a)]);
        return [esk, mcl.mul(utils.g1(), x)];
    }

    static exchange(b, B, A, X) {
        const esk = this.gen_ekey();
        const y = utils.hash_ss(esk, utils.serialize(b));

        const K = utils.hash1([mcl.mul(A, y), mcl.mul(X, b), mcl.mul(X, y), A, B], true, false);

        return [esk, K, mcl.mul(utils.g1(), y)];
    }

    static finish(a, A, esk, B, Y) {
        const x = utils.hash1([esk, utils.serialize(a)]);

        const K = utils.hash1([mcl.mul(Y, a), mcl.mul(B, x), mcl.mul(Y, x), A, B], true, false);

        return K;
    }

    static test() {
        const [a, A] = this.gen_keys();
        const [b, B] = this.gen_keys();

        const [esk_a, X] = this.init(a);

        const [esk_b, K_b, Y] = this.exchange(b, B, A, X);

        const K_a = this.finish(a, A, esk_a, B, Y);

        return K_a === K_b;
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

module.exports= Naxos
