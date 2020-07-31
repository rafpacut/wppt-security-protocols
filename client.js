const mcl = require('mcl-wasm');
const rp = require('request-promise');
const Rp_wrapper = require('./rp_wrapper.js');
const connectionUtils = require("./connectionUtils.js");
const clientUtils = require('./clientUtils.js');

const protocols_supported = ["sis", "ois", "sss", "msis", "blsss", "sigma", "naxos"];
const encryption_modes_supported = ["chacha", "salsa"];

mcl.init(mcl.BLS12_381).then(()=>{

[hostname, port] = connectionUtils.readConConfig("client.config");
const path = '/protocols/';

let [protocol_name, encryption_mode] = clientUtils.processCmdArgs(process.argv, protocols_supported, encryption_modes_supported);

console.log(`trying (encMode: ${encryption_mode}) ${protocol_name} protocol with ${hostname}:${port}`);
var options = {
        uri: `${hostname}:${port}${path}`,
        json: true
};
let rp_wrapper = new Rp_wrapper(encryption_mode);

rp(options)
.then(res =>{
    let client = clientUtils.createClient(protocol_name, res.schemas, rp_wrapper);
    client.init();
});


})//------end of mcl.init promise-----------
