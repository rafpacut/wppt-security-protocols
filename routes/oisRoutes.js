const express = require('express');
const router = express.Router();
const OisController = require('../ois/oisController.js');
const routesUtils = require('./routesUtils.js');

router.post('/protocols/ois/init', (req, res) => {
    res.locals.oisController = new OisController();
    let token = routesUtils.registerSession(req, res, "ois", res.locals.oisController);
    res.locals.oisController.handleInit(req, res, token);
});

router.post('/protocols/ois/verify', (req, res) => {
    let controller = routesUtils.getSessionController(req);
    controller.handleVerify(req, res);
});

module.exports = router;