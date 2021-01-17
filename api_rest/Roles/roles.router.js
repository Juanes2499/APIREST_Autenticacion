const {
    crearRol,
    consultarRoles,
    consultarRolByNombreRol,
    actualizarRolByID,
    eliminarRolByID,
} = require('./roles.controller');

const router = require('express').Router();

router.post("/", crearRol);
router.get("/", consultarRoles);
router.get("/nombreRol", consultarRolByNombreRol);
router.put("/", actualizarRolByID);
router.delete("/", eliminarRolByID);

module.exports = router;