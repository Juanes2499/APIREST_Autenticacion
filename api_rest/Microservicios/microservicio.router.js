const {
    crearMicroservicio,
    consultarMicroservicioDinamico,
    actualizarMicroservicioByID,
    eliminarMicroservicioById
} = require('./microservicio.controller');
const router = require('express').Router();

router.post("/", crearMicroservicio);
router.post("/get", consultarMicroservicioDinamico);
router.put("/", actualizarMicroservicioByID);
router.post("/delete", eliminarMicroservicioById);
    
module.exports = router;