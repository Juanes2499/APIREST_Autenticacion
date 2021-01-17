const {
    crearUsuario, 
    consultarUsuarios,
    consultarUsuariosByID, 
    consultarUsuariosByEmail,
    actualizarUsuarioById,
    eliminarUsuarioById,
    login
} = require('./user.controller');
const router = require('express').Router();

router.post("/",crearUsuario);
router.get("/", consultarUsuarios);
router.get("/idUser", consultarUsuariosByID);
router.get("/emailUser", consultarUsuariosByEmail);
router.put("/", actualizarUsuarioById),
router.delete("/", eliminarUsuarioById);
router.post("/login", login);
    
module.exports = router;