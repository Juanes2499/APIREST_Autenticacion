const {
    crearDispositivo,
    consultarDispositivos,
    actualizarDispositivoById,
    eliminarDispositivoById,
    validarEstadoContrasena,
    solicitarCambioContrasena,
    actualizarContrasena,
    actualizarTokenDispositivo
} = require('./Dispositivos.controller');

// const {
//     consultarMicroservicioDinamico
// } = require('../Microservicios/microservicio.controller');

const router = require('express').Router();

router.post("/", crearDispositivo);
router.post("/get", consultarDispositivos);
router.put("/", actualizarDispositivoById),
router.post("/delete", eliminarDispositivoById);
// router.post("/validarEstadoContrasena", validarEstadoContrasena);
// router.post("/solicitarCambioContrasena", solicitarCambioContrasena);
// router.post("/actualizarContrasena", actualizarContrasena);
router.put("/actualizarTokenDispositivo", actualizarTokenDispositivo);

//Adicionales
//router.post('/microservicios/get', consultarMicroservicioDinamico);
    
module.exports = router;