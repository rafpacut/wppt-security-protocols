const mcl = require('mcl-wasm');
const crypto = require('crypto');
const chacha = require('chacha');


mcl.init(mcl.BLS12_381);


function g1() {
    const g1 = new mcl.G1();
    g1.setStr('1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569');
    return g1;
}


function g2() {
    const g2 = new mcl.G1();
    g2.setStr('1 2144250947445192081071618466765046647019257686245947349033844530891338159027816696711238671324221321317530545114427 2665798332422762660334686159210698639947668680862640755137811598895238932478193747736307724249253853210778728799013');
    return g2;
}


function serialize(x) {
    const str = x.getStr();
    if (str.startsWith('1 ')) {
        return str.slice(2);
    } else {
        return str;
    }
}


function deserialize(str) {
    const spaces = str.split(' ').length - 1;
    if (spaces === 1) {
        const x = new mcl.G1();
        x.setStr('1 ' + str);
        return x;
    } else if (spaces > 1) {
        const x = new mcl.G2();
        x.setStr('1 ' + str);
        return x;
    } else {
        const x = new mcl.Fr();
        x.setStr(str);
        return x;
    }
}


function fromHex(h) {
  h = h.replace(/([^0-9a-f])/g, '');
  return new Buffer(h, 'hex');
}


function poly1305(key, str) {
    const mac = chacha.createHmac(key);
    mac.update(str);
    return mac.digest()
}


function _hexToDec(s) {
    var i, j, digits = [0], carry;
    for (i = 0; i < s.length; i += 1) {
        carry = parseInt(s.charAt(i), 16);
        for (j = 0; j < digits.length; j += 1) {
            digits[j] = digits[j] * 16 + carry;
            carry = digits[j] / 10 | 0;
            digits[j] %= 10;
        }
        while (carry > 0) {
            digits.push(carry % 10);
            carry = carry / 10 | 0;
        }
    }
    return digits.reverse().join('');
}


function _hexToFr(hex) {
    const c = new mcl.Fr();
    c.setStr(_hexToDec(hex));
    // c.setHashOf(hex);
    return c;
}


function _hash(...args) {
    const hash = crypto.createHash('SHA3-512');
    args.forEach(arg => hash.update(arg));

    return hash.digest('hex').slice(64);
}


function hash1(args, serialize_args=false, cast=true) {
    const digest = serialize_args ? _hash(...args.map(x => serialize(x))) : _hash(...args);
    return cast ? _hexToFr(digest) : digest;
}


function hash_to_str(str, curve_point) {
    return crypto.createHash('SHA3-256')
        .update(str)
        .update(serialize(curve_point))
        .digest();
}

function hash_ss(str1, str2, to_str=false) {
    const hash = crypto.createHash('SHA3-256')
        .update(str1)
        .update(str2)
        .digest('hex');

    if (to_str) {
        return hash;
    } else {
        const c = new mcl.Fr();
        c.setHashOf(hash);
        return c;
    }
}

function hash(str, curve_point) {
    const c = new mcl.Fr();
    c.setHashOf(hash_to_str(str, curve_point));

    return c;
}


function hash_g_f(X, y) {
    // rafał
    return mcl.hashAndMapToG2(
        X.getStr(10).slice(2) + y.getStr(10)
    );

    return mcl.hashAndMapToG2(
        serialize(X) + serialize(y)
    );
}




module.exports = {
    g1,
    g2,
    serialize,
    deserialize,
    hash,
    hash_to_str,
    hash_g_f,
    hash_ss,
    hash1,
    poly1305
};
