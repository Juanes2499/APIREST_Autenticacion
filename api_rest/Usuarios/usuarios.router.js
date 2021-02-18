const {
    crearUsuario, 
    consultarUsuarios,
    actualizarUsuarioById,
    eliminarUsuarioById,
    login
} = require('./usuarios.controller');
const router = require('express').Router();

router.post("/",crearUsuario);
router.get("/", consultarUsuarios);
router.put("/", actualizarUsuarioById),
router.delete("/", eliminarUsuarioById);
router.post("/login", login);
    
module.exports = router;