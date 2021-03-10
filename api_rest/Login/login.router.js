const {
    login,
    solicitarCambioContrasena,
    actualizarContrasena,
} = require('./login.controller');
const router = require('express').Router();

router.post("/", login);
router.post("/emailPassword", solicitarCambioContrasena);
router.put("/updatePassword", actualizarContrasena);
    
module.exports = router;