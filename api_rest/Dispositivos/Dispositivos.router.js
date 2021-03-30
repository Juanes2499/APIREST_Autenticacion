const {
    crearDispositivo,
    consultarDispositivos,
    actualizarDispositivoById,
    eliminarDispositivoById
} = require('./Dispositivos.controller');
const router = require('express').Router();

router.post("/", crearDispositivo);
router.post("/get", consultarDispositivos);
router.put("/", actualizarDispositivoById),
router.post("/delete", eliminarDispositivoById);
    
module.exports = router;