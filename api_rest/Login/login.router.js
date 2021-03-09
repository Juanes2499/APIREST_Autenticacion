const {
    login,
    solicitarCambioContrasena
} = require('./login.controller');
const router = require('express').Router();

router.post("/", login);
router.post("/emailPassword", solicitarCambioContrasena);
    
module.exports = router;