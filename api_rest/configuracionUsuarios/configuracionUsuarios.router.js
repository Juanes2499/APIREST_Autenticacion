const {
    crearConfiguracionUsuarios,
    consultarConfiguracionUsuarioDinamico,
    eliminarConfiguracionUsuarioByID
} = require('./configuracionUsuarios.controller');
const router = require('express').Router();

router.post('/', crearConfiguracionUsuarios);
router.post('/get', consultarConfiguracionUsuarioDinamico);
router.post('/delete', eliminarConfiguracionUsuarioByID )

module.exports = router;