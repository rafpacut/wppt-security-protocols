const express = require('express');
const router = express.Router();
const SigmaController = require('../sigma/sigmaController.js');
const routesUtils = require('./routesUtils.js');

router.post('/protocols/sigma/init', (req, res) => {
    res.locals.sigmaController = new SigmaController();
    let token = routesUtils.registerSession(req, res, "sigma", res.locals.sigmaController);
    res.locals.sigmaController.handleInit(req, res, token);
});

router.post('/protocols/sigma/exchange', (req, res) => {
    let controller = routesUtils.getSessionController(req);
    controller.handleExchange(req, res);
});

module.exports = router;