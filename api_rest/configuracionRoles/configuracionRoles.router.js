const {
    crearConfiguracionRol,
    consultarRolesAsiganadosUsuarios,
    consultarRolesAsiganadosUsuariosByNombreRol,
    consultarRolesAsiganadosUsuariosByEmail,
    eliminarConfiguracionRolByID,
} = require('./configuracionRoles.controller');

const router = require('express').Router();

router.post("/", crearConfiguracionRol);
router.get("/", consultarRolesAsiganadosUsuarios);
router.get("/nombreRol", consultarRolesAsiganadosUsuariosByNombreRol);
router.get("/email", consultarRolesAsiganadosUsuariosByEmail);
router.delete("/", eliminarConfiguracionRolByID);

module.exports = router;