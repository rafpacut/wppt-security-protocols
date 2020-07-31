const appCrypto = require('./appCrypto.js')

function encode(value)
{
    return value.getStr().slice(2);
}

function decode(value)
{
    return "1 "+value.toString();
}

function removeToken(token){
    for(var i = 0; i < sessionIDs.length; i++){
        if(sessionIDs[i].id === token){
            sessionIDs.splice(i);
            return;
        }
    }
}

function fromBase64(data){
    return Buffer.from(data, 'base64');
}

function toBase64(data){
    return Buffer.from(data).toString('base64');
}

function encryptReqBody(reqBody, encryptionMode){
    let reqBodyJSONStr = JSON.stringify(reqBody);
    let ciphertext_b64, nonce_b64, tag_b64;
    if(encryptionMode == 'chacha'){
        [nonce_b64, ciphertext_b64, tag_b64] = appCrypto.encrypt(reqBodyJSONStr, encryptionMode);
        reqBody = {
            ciphertext: ciphertext_b64,
            nonce: nonce_b64,
            tag: tag_b64
        }
        return reqBody;
    }

    if(encryptionMode == 'salsa'){
        [nonce_b64, ciphertext_b64] = appCrypto.encrypt(reqBodyJSONStr, encryptionMode);
        reqBody = {
            ciphertext: ciphertext_b64,
            nonce: nonce_b64,
        }
        return reqBody;
    }
    throw "Unsupported encryption mode "+encryptionMode;
}

module.exports.removeToken = removeToken;
module.exports.encode = encode;
module.exports.decode = decode;
module.exports.fromBase64 = fromBase64;
module.exports.toBase64 = toBase64;
module.exports.encryptReqBody = encryptReqBody;