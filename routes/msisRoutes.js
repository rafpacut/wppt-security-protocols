const express = require('express');
const router = express.Router();
const routesUtils = require('./routesUtils.js');
const MsisController = require('../msis/msisController.js');


router.post('/protocols/msis/init', (req, res) => {
    res.locals.msisController = new MsisController();
    let token = routesUtils.registerSession(req, res, "msis", res.locals.msisController);
    res.locals.msisController.handleInit(req, res, token);
});

router.post('/protocols/msis/verify', (req, res) => {
    let controller = routesUtils.getSessionController(req);
    controller.handleVerify(req, res);
});
   
module.exports = router;
