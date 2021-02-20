const {
    crearConfiguracionRol,
    consultarConfiguraciRolesDinamico,
    eliminarConfiguracionRolByID,
} = require('./configuracionRoles.controller');

const router = require('express').Router();

router.post("/", crearConfiguracionRol);
router.get("/", consultarConfiguraciRolesDinamico);
router.delete("/", eliminarConfiguracionRolByID);

module.exports = router;