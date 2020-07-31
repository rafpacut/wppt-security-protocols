const SisClient = require('./sis/sisClient.js');
const OisClient = require('./ois/oisClient.js');
const SssClient = require('./sss/sssClient.js');
const BlsssClient = require('./blsss/blsssClient.js');
const MsisClient = require('./msis/msisClient.js');
const SigmaClient = require('./sigma/sigmaClient.js');
const NaxosClient = require('./naxos/naxosClient.js');

function createClient(protocol_name, schemas, rp_wrapper) {
    let client;
    switch(protocol_name){
        case "sis":
            client = new SisClient(rp_wrapper); break;
        case "ois":
            client = new OisClient(rp_wrapper); break;
        case "sss":
            client = new SssClient(rp_wrapper); break;
        case "blsss":
            client = new BlsssClient(rp_wrapper); break;
        case "msis":
            client = new MsisClient(rp_wrapper); break;
        case "sigma":
            client = new SigmaClient(rp_wrapper); break;
        case "naxos":
            client = new NaxosClient(rp_wrapper); break;
        default:
            throw `client does not support ${protocol_name}`
    }
    //compat -- for now
    //if(!schemas.includes(protocol_name)){
        //throw `${hostname} does not support ${protocol_name}`;
    //}
    return client;
}

function processCmdArgs(argv, protocols_supported, encryption_modes_supported) {
    const isEncryptionModeSpecified = (argv.length > 3) && encryption_modes_supported.includes(argv[2]);
    if(isEncryptionModeSpecified) {
        encryption_mode = argv[2];
        protocol_name = argv[3];
        if(!protocols_supported.includes(protocol_name))
            throw `we are not supporting ${protocol_name} protocol, dummy.`;
    }
    else {
        const isProtocolSpecified = (argv.length > 2) && protocols_supported.includes(argv[2]);
        if(isProtocolSpecified) {
            protocol_name = argv[2];
        }
        else {
            protocol_name = protocols_supported[0];
        }
        encryption_mode = 'none';
    }
    return [protocol_name, encryption_mode]
}

module.exports.createClient = createClient;
module.exports.processCmdArgs = processCmdArgs;