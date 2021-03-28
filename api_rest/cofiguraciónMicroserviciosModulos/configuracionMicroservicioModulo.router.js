const {
    crearConfiguracioMicroservicioModulo,
    consultarConfiguracioMicroservicioModuloDinamico,
    eliminarConfiguracioMicroservicioModuloByID
} = require('./configuracionMicroservicioModulo.controller');

const {
    consultarMicroservicioDinamico
} = require('../Microservicios/microservicio.controller');

const {
    consultarModuloDinamico
} = require('../Modulos/modulo.controller');

const router = require('express').Router();

router.post('/', crearConfiguracioMicroservicioModulo);
router.post('/get', consultarConfiguracioMicroservicioModuloDinamico);
router.post('/delete', eliminarConfiguracioMicroservicioModuloByID);

//Adicioanales
router.post('/microservicios/get', consultarMicroservicioDinamico);
router.post('/modulos/get', consultarModuloDinamico);


module.exports = router;