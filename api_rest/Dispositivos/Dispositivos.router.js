const {
    crearDispositivo,
    consultarDispositivos,
    actualizarDispositivoById,
    eliminarDispositivoById,
    validarEstadoContrasena,
    actualizarContrasena,
} = require('./Dispositivos.controller');

const {
    consultarMicroservicioDinamico
} = require('../Microservicios/microservicio.controller');

const router = require('express').Router();

router.post("/", crearDispositivo);
router.post("/get", consultarDispositivos);
router.put("/", actualizarDispositivoById),
router.post("/delete", eliminarDispositivoById);
router.post("/validarEstadoContrasena", validarEstadoContrasena);
router.post("/actualizarContrasena", actualizarContrasena);

//Adicionales
router.post('/microservicios/get', consultarMicroservicioDinamico);
    
module.exports = router;