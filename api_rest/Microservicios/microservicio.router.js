const {
    crearMicroservicio,
    consultarMicroservicioDinamico,
    actualizarMicroservicioByID,
    eliminarMicroservicioById
} = require('./microservicio.controller');
const router = require('express').Router();

router.post("/", crearMicroservicio);
router.get("/", consultarMicroservicioDinamico);
router.put("/", actualizarMicroservicioByID);
router.delete("/", eliminarMicroservicioById);
    
module.exports = router;