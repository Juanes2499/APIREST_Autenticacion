const {
    crearRol,
    consultarRolesDinamico,
    eliminarRolByID,
} = require('./roles.controller');

const router = require('express').Router();

router.post("/", crearRol);
router.get("/", consultarRolesDinamico);
router.delete("/", eliminarRolByID);

module.exports = router;