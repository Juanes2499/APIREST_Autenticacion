const {
    crearUsuario, 
    consultarUsuarios,
    actualizarUsuarioById,
    eliminarUsuarioById,
} = require('./usuarios.controller');
const router = require('express').Router();

router.post("/",crearUsuario);
router.post("/get", consultarUsuarios);
router.put("/", actualizarUsuarioById),
router.delete("/", eliminarUsuarioById);
    
module.exports = router;