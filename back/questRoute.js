const express = require('express');
const router = express.Router();
const questController = require('./questController');

// Production quest Routes
    router.post('/quest', questController.create);
    router.get('/quest', questController.findAll);
    router.get('/quest/:id', questController.findOne);
    router.put('/quest/:id', questController.update);
    router.delete('/quest/:id', questController.delete);
    router.delete('/quest', questController.deleteAll);

module.exports = router;