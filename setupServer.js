const ProtocolConnectionWrapper = require('./protocolConnectionWrapper.js');
const sisRoutes = require("./routes/sisRoutes.js");
const oisRoutes = require("./routes/oisRoutes.js");
const sssRoutes = require("./routes/sssRoutes.js");
const msisRoutes = require("./routes/msisRoutes.js");
const blsssRoutes = require("./routes/blsssRoutes.js");
const sigmaRoutes = require("./routes/sigmaRoutes.js");
const naxosRoutes = require("./routes/naxosRoutes.js");
const connectionUtils = require("./connectionUtils.js");

const appCrypto = require("./appCrypto.js");


//---------Connection parameters-------------------
const [hostname, port] = connectionUtils.readConConfig("server.config");

//---------Misc declarations-------------------
const availableProtocols = ["sis", "ois", "sss", "msis", "blsss", "sigma", "naxos"];
sessionIDs = [];

//-------------sodium encryption layer stripping declarations-------------------------
function stripSalsa(req,res, next) {
    let encMode = 'salsa';
    req.body = appCrypto.decrypt(req.body, encMode);
    res.locals.conWrapper.setEncryption(encMode);
    next();
}

function stripChacha(req,res,next){
    let encMode = 'chacha';
    req.body = appCrypto.decrypt(req.body, encMode);
    res.locals.conWrapper.setEncryption(encMode);
    next();
}

function setDefaultConnection(req,res,next){
    let defaultEncryptionMode = 'none';
    res.locals.conWrapper = new ProtocolConnectionWrapper(defaultEncryptionMode);
    next();
}

//-----------routes------------------------
var express = require('express');
var app = express();
const cors = require('cors')
app.use(cors())

mcl.init(mcl.BLS12_381).then(()=>{

app.get('/protocols/', (req, res) => {
    res.json({schemas : availableProtocols});
})

const protocolRoutes = express.Router();

protocolRoutes.use(sisRoutes);
protocolRoutes.use(oisRoutes);
protocolRoutes.use(sssRoutes);
protocolRoutes.use(msisRoutes);
protocolRoutes.use(blsssRoutes);
protocolRoutes.use(sigmaRoutes);
protocolRoutes.use(naxosRoutes);

app.use(express.json());
app.use(setDefaultConnection);
app.use('/salsa', [stripSalsa, protocolRoutes]);
app.use('/chacha', [stripChacha, protocolRoutes]);
app.use('', protocolRoutes);



app.listen(port);

console.log(`server listening on ${hostname}:${port}`);
});//-------end of mcl.init promise-------------------
