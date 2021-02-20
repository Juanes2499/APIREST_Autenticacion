const {
    crearConfiguracionUsuarios,
    consultarConfiguracionUsuarioDinamico,
    eliminarConfiguracionUsuarioByID
} = require('./configuracionUsuarios.controller');
const router = require('express').Router();

router.post('/', crearConfiguracionUsuarios);
router.get('/', consultarConfiguracionUsuarioDinamico);
router.delete('/', eliminarConfiguracionUsuarioByID )

module.exports = router;