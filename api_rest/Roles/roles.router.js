const {
    crearRol,
    consultarRolesDinamico,
    eliminarRolByID,
} = require('./roles.controller');

const router = require('express').Router();

router.post("/", crearRol);
router.post("/get", consultarRolesDinamico);
router.post("/delete", eliminarRolByID);

module.exports = router;