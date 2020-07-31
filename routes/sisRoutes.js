const express = require('express');
const router = express.Router();
const routesUtils = require('./routesUtils.js');
const SisController = require('../sis/sisController.js');


//\\//\\//\\//\\//\\//\\-----SIS-------//\\//\\//\\//\\//\\//\\
router.post('/protocols/sis/init', (req, res) => {
    res.locals.sisController = new SisController();
    let token = routesUtils.registerSession(req, res, "sis", res.locals.sisController);
    res.locals.sisController.handleInit(req, res, token);
});

router.post('/protocols/sis/verify', (req, res) => {
    let controller = routesUtils.getSessionController(req);
    controller.handleVerify(req, res);
});
   
//\\//\\//\\//\\//\\//\\-----SIS END-------//\\//\\//\\//\\//\\//\\

module.exports = router;
