const SessionID = require('../sessionID.js');

function getSessionController(req){
    let session = sessionIDs.find( session =>{
        return session.token === req.body.session_token;
    });
    if(session === undefined) {throw `session ${req.body.session_token} not found`}
    return session.controller;
}

function registerSession(req, res, protocolName, controller){
    let session = new SessionID(req.ip, protocolName, controller)
    sessionIDs.push(session);
    console.log(`${session.ip} initiated new ${protocolName} with token ${session.token}`);
    return session.token;
}

module.exports.registerSession = registerSession;
module.exports.getSessionController = getSessionController;