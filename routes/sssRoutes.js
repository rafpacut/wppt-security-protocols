const SssController = require('../sss/sssController.js');
const express = require('express');
const routesUtils = require('./routesUtils.js');
const router = express.Router();

router.post('/protocols/sss/verify', (req, res) => {
    res.locals.sssController = new SssController();
    let token = routesUtils.registerSession(req, res, "sss", res.locals.sssController);
    res.locals.sssController.handleInit(req, res, token);
});

module.exports = router;