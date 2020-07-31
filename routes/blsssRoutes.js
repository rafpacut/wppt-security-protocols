const BlsssController = require('../blsss/blsssController.js');
const express = require('express');
const routesUtils = require('./routesUtils.js');
const router = express.Router();

router.post('/protocols/blsss/verify', (req, res) => {
    res.locals.blsssController = new BlsssController();
    let token = routesUtils.registerSession(req, res, "blsss", res.locals.blsssController);
    res.locals.blsssController.handleInit(req, res, token);
});

module.exports = router;