const {
    crearModulo,
    consultarModuloDinamico,
    actualizarModuloByID,
    eliminarModuloById
} = require('./modulo.controller');
const router = require('express').Router();

router.post('/', crearModulo);
router.get('/', consultarModuloDinamico);
router.put('/', actualizarModuloByID);
router.delete('/', eliminarModuloById);

module.exports = router;