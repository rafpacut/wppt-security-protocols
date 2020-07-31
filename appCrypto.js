const _sodium = require('libsodium-wrappers');
const fs = require('fs');
const crypto = require('crypto');
const chachaLib = require('chacha');

const chachaNonceLength = 12;
const salsaNonceLength = 24;

function salsa(payload) { 
	let key = fs.readFileSync('./keys/salsa.key');

	const sodium = _sodium;

	let nonce = sodium.randombytes_buf(salsaNonceLength);
	let encPayload = sodium.crypto_secretbox_easy(sodium.from_string(payload), nonce, key);

	return [nonce, encPayload].map(x=> sodium.to_base64(x, sodium.base64_variants.ORIGINAL));
}

function chacha(payload) {
	const key = fs.readFileSync('./keys/chacha.key');

	const nonce = crypto.randomBytes(chachaNonceLength);
	const cipher = chachaLib.createCipher(key, nonce);

	let ciphertext = cipher.update(payload, 'utf-8', 'base64');
	ciphertext += cipher.final('base64');

	let tag = cipher.getAuthTag();
	let tag_b64 = Buffer.from(tag).toString('base64');
	let nonce_b64 = Buffer.from(nonce).toString('base64');
	return [nonce_b64, ciphertext, tag_b64];
}

function unchacha(payload) {
	if(!payload.hasOwnProperty('ciphertext')){throw "Decrypting unencrypted response";}

	let key = fs.readFileSync('./keys/chacha.key');

	let ciphertext = payload.ciphertext;
	let nonce = Buffer.from(payload.nonce, 'base64');
	let tag = Buffer.from(payload.tag, 'base64');

	const decipher = chachaLib.createDecipher(key, nonce);
	decipher.setAuthTag(tag);


	let plaintext = decipher.update(ciphertext, 'base64', 'utf-8');
	plaintext += decipher.final('utf-8');

	return plaintext;
}

function unsalsa(payload) {
	if(!payload.hasOwnProperty('ciphertext')){throw "Decrypting unencrypted response";}

	let key = fs.readFileSync('./keys/salsa.key');

	const sodium = _sodium;
	let [nonce, ciphertext] = [payload.nonce, payload.ciphertext].map(x=> Buffer.from(x, 'base64'));

	let res = sodium.crypto_secretbox_open_easy(ciphertext, nonce, key);
	return sodium.to_string(res);
}

function encrypt(payload, encryptionMode){
	switch(encryptionMode) {
		case 'none': 
			return payload; 
		case 'salsa': 
			return salsa(payload);
		case 'chacha': 
			return chacha(payload);
	}
}

function decrypt(payload, encryptionMode){
	let m_JSON;
	switch(encryptionMode) {
		case 'none': 
			return payload;
		case 'salsa': 
			m_JSON = unsalsa(payload);
			return JSON.parse(m_JSON);
		case 'chacha': 
			m_JSON = unchacha(payload);
			return JSON.parse(m_JSON);
	}
}

module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;