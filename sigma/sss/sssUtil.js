const crypto = require("crypto");

function hash(value)
{
    const r = '0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001';
    const hash = crypto.createHash('SHA3-512')
    hash.update(value);
    const mHash = hash.digest('hex')
    //console.log(`hash output: ${mHash}`)

    const rInt = BigInt(r);
    const hashInt = BigInt('0x'+mHash);
    return (hashInt % rInt).toString();
}

module.exports.hash = hash;
