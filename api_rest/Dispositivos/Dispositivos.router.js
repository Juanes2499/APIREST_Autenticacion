const {
    crearDispositivo,
    consultarDispositivos,
    actualizarDispositivoById,
    eliminarDispositivoById
} = require('./Dispositivos.controller');

const {
    consultarMicroservicioDinamico
} = require('../Microservicios/microservicio.controller');

const router = require('express').Router();

router.post("/", crearDispositivo);
router.post("/get", consultarDispositivos);
router.put("/", actualizarDispositivoById),
router.post("/delete", eliminarDispositivoById);

//Adicioanales
router.post('/microservicios/get', consultarMicroservicioDinamico);
    
module.exports = router;