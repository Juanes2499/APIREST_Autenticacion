const {
    login,
    solicitarCambioContrasena,
    actualizarContrasena,
    loginDispositivo
} = require('./login.controller');
const router = require('express').Router();

router.post("/", login);
router.post("/emailPassword", solicitarCambioContrasena);
router.put("/updatePassword", actualizarContrasena);
router.post("/device", loginDispositivo);
    
module.exports = router;