const {
    crearModulo,
    consultarModuloDinamico,
    actualizarModuloByID,
    eliminarModuloById
} = require('./modulo.controller');
const router = require('express').Router();

router.post('/', crearModulo);
router.post('/get', consultarModuloDinamico);
router.put('/', actualizarModuloByID);
router.post('/delete', eliminarModuloById);

module.exports = router;