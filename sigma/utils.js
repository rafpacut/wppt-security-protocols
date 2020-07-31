//const Poly1305 = require("poly1305-js")
const chacha = require('chacha')
const Signer = require("./sss/Signer.js")
const Verifier = require("./sss/Verifier.js")
const crypto = require("crypto");

function checkMAC(pk, mac, mac_key){
    return true
    //return chacha.(pk.getStr(10), mac_key, mac);
}

function genMACKey(gxy){
    const hash = crypto.createHash('SHA3-256') 
    hash.update("mac_"+gxy.getStr(10).slice(2))
    return hash.digest()
}

function createMAC(mac_key, pk){
    const mac = chacha.createHmac(mac_key)
    mac.update(pk.getStr().slice(2));
    return mac.digest()
}

function createSessionKey(gxy){
    const hash = crypto.createHash('SHA3-256') 
    hash.update("session_"+gxy.getStr(10).slice(2))
    return hash.digest('base64')
}

function createCheckMsg(sessionKey_b64, msg){
    const hash = crypto.createHash('SHA3-512') 
    const msg_b64 = Buffer.from(msg).toString('base64')
    const input_bin = Buffer.from(sessionKey_b64 + msg_b64, 'base64')
    hash.update(input_bin);
    return hash.digest()
}

function signXY(X, Y, sk, pk, g){
    let signer = new Signer(sk, pk, g)
    const toSign = `${X.getStr().slice(2)}${Y.getStr().slice(2)}`;
    return signer.sign(toSign)
}

function checkSignature(B, X, Y, s_b, X_b, g){
    const verifier = new Verifier(B, g);
    const msg = `${X.getStr(10).slice(2)}${Y.getStr().slice(2)}`
    //const msg = X.getStr(10).slice(2)+Y.getStr(10).slice(2)
    //console.log(msg)
    return verifier.verify(msg, s_b, X_b)
}

module.exports.checkMAC = checkMAC;
module.exports.checkSignature = checkSignature;
module.exports.genMACKey = genMACKey;
module.exports.createMAC = createMAC;
module.exports.createCheckMsg = createCheckMsg;
module.exports.signXY = signXY;
module.exports.createSessionKey = createSessionKey;