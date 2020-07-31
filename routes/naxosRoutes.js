const express = require('express');
const router = express.Router();
const NaxosController = require('../naxos/naxosController.js');
const routesUtils = require('./routesUtils.js');

//there should be no controller per IP
router.get('/protocols/naxos/Pkey', (req, res) => {
    res.locals.naxosController = new NaxosController();
    routesUtils.registerSession(req, res, "naxos", res.locals.naxosController);
    res.locals.naxosController.handlePkey(res);
});

//Unfortunately agreed API standard does not include token for this protocol,
//so here controller (naxos responder instance) is linked to initiator's ip.
router.post('/protocols/naxos/exchange', (req, res) => {
    let session = sessionIDs.find( session =>{
        return session.ip === req.ip
    });
    if(session === undefined) {throw `session for ip ${req.ip} not found`}
    const controller = session.controller;

    controller.handleExchange(req, res);
});

module.exports = router;