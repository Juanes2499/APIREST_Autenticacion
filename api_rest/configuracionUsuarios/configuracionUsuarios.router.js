const {
    crearConfiguracionUsuarios,
    consultarConfiguracionUsuarioDinamico,
    eliminarConfiguracionUsuarioByID
} = require('./configuracionUsuarios.controller');

const {
    consultarMicroservicioDinamico
} = require('../Microservicios/microservicio.controller');

const {
    consultarModuloDinamico
} = require('../Modulos/modulo.controller');

const router = require('express').Router();

router.post('/', crearConfiguracionUsuarios);
router.post('/get', consultarConfiguracionUsuarioDinamico);
router.post('/delete', eliminarConfiguracionUsuarioByID);

//Adicioanales
router.post('/microservicios/get', consultarMicroservicioDinamico);
router.post('/modulos/get', consultarModuloDinamico);

module.exports = router;