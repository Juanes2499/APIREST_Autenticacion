const {
    consultarConfiguracioMicroservicioModuloDinamico,
} = require('./configuracionMicroservicioModulo.controller');


const router = require('express').Router();

router.post('/', consultarConfiguracioMicroservicioModuloDinamico);

module.exports = router;