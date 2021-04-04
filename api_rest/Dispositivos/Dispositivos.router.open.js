const {
    consultarDispositivos,
} = require('./Dispositivos.controller');

const router = require('express').Router();

router.post("/get", consultarDispositivos);

module.exports = router;