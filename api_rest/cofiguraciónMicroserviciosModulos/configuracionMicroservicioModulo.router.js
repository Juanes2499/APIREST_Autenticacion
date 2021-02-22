const {
    crearConfiguracioMicroservicioModulo,
    consultarConfiguracioMicroservicioModuloDinamico,
    eliminarConfiguracioMicroservicioModuloByID
} = require('./configuracionMicroservicioModulo.controller');
const router = require('express').Router();

router.post('/', crearConfiguracioMicroservicioModulo);
router.post('/get', consultarConfiguracioMicroservicioModuloDinamico);
router.delete('/', eliminarConfiguracioMicroservicioModuloByID);

module.exports = router;