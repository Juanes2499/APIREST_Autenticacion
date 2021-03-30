const {
    crear_microservicio,
    consultar_microservicioDinamico,
    actualizar_microservicio_ByID,
    eliminar_microservicio_byId
} = require('./microservicio.service');
const {MensajeverificarParametrosJson} = require("../../shared/verificarParametrosJson");

module.exports = {
    crearMicroservicio: (req,res)=>{

        const body = req.body;

        const parametrosEndpoint = {
            nombre_microservicio: true,
            detalles: true,
            url_microservicio: true,
            alias_microservicio: true,
            url_alias_microservicio: true,
            icon_microservicio: true,
            orden: true,
        };
        
        const arrayParametrosJsonComparar = Object.keys(body);
        
        const verificarParametro = MensajeverificarParametrosJson(parametrosEndpoint, arrayParametrosJsonComparar)

        if(verificarParametro.error === true || verificarParametro.messageFaltantes != null || verificarParametro.messageMalEscritos != null ){
            
            const errorData = {
                mensaje_retornado: `${verificarParametro.messageFaltantes}, please set up all required parameters`
            }

            return res.status(500).json({
                success: false,
                statusCode: 500,
                message: errorData.mensaje_retornado
            })
        }
        
        crear_microservicio(body, (err, result, state)=>{
            if(err){
                console.log(err);
                return res.status(500).json({
                    success:state,
                    statusCode:500,
                    message: "Database create error - crearMicroservicio",
                    return: err
                })
            }
            return res.status(201).json({
                success: state,
                statusCode:201,
                message: `The register with NOMBRE_MICROSERVICIO: ${body.nombre_microservicio} was successfully created`,
              });
        });
    },
    consultarMicroservicioDinamico: (req, res) => {

        const body = req.body;

        const parametrosEndpoint = {
            seleccionar: true,
            condicion: true,
            agrupar: true,
            ordenar: true,   
        };
        
        const arrayParametrosJsonComparar = Object.keys(body);
        
        const verificarParametro = MensajeverificarParametrosJson(parametrosEndpoint, arrayParametrosJsonComparar)

        if(verificarParametro.error === true || verificarParametro.messageFaltantes != null || verificarParametro.messageMalEscritos != null ){
            
            const errorData = {
                mensaje_retornado: `${verificarParametro.messageFaltantes}, please set up all required parameters`
            }

            return res.status(500).json({
                success: false,
                statusCode: 500,
                message: errorData.mensaje_retornado
            })
        }

        consultar_microservicioDinamico(body, (err, result, state) => {
            if (state === false) {
                console.log(err);
                return res.status(500).json({
                    success:state,
                    message: "Database get error - error in consultarMicroservicerDinamico",
                    return: err
                })
            }

            return res.status(200).json({
                success: state,
                statusCode:200,
                data: result
            });
        });
    },
    actualizarMicroservicioByID: (req, res) => {
        
        const body = req.body;

        const parametrosEndpoint = {
            id_microservicio: true,
            nombre_microservicio: true,
            detalles: true,
            url_microservicio: true,
            alias_microservicio: true,
            url_alias_microservicio: true,
            icon_microservicio: true,
            orden: true,
        };
        
        const arrayParametrosJsonComparar = Object.keys(body);
        
        const verificarParametro = MensajeverificarParametrosJson(parametrosEndpoint, arrayParametrosJsonComparar)

        if(verificarParametro.error === true || verificarParametro.messageFaltantes != null || verificarParametro.messageMalEscritos != null ){
            
            const errorData = {
                mensaje_retornado: `${verificarParametro.messageFaltantes}, please set up all required parameters`
            }

            return res.status(500).json({
                success: false,
                statusCode: 500,
                message: errorData.mensaje_retornado
            })
        }

        actualizar_microservicio_ByID(body, (err, result, state) => {

            if(state === false){
                console.log(err);
                return res.status(403).json({
                    success: state, 
                    statusCode: 403,
                    message: "Database put error - error in actualizarMicroservicioByID",
                    return: err
                });
            }

            return res.status(200).json({
                success: state,
                statusCode:200,
                message: `The microservice with ID_MICROSERVICIO: ${body.id_microservicio} was successfully updated`
            });
        });
    },
    eliminarMicroservicioById: (req, res) => {

        const body = req.body;

        const parametrosEndpoint = {
            id_microservicio: true,
        };
        
        const arrayParametrosJsonComparar = Object.keys(body);
        
        const verificarParametro = MensajeverificarParametrosJson(parametrosEndpoint, arrayParametrosJsonComparar)

        if(verificarParametro.error === true || verificarParametro.messageFaltantes != null || verificarParametro.messageMalEscritos != null ){
            
            const errorData = {
                mensaje_retornado: `${verificarParametro.messageFaltantes}, please set up all required parameters`
            }

            return res.status(500).json({
                success: false,
                statusCode: 500,
                message: errorData.mensaje_retornado
            })
        }

        eliminar_microservicio_byId(body, (err, result, state) => {

            if(state === false){
                return res.status(403).json({
                    success: state, 
                    statusCode: 403,
                    message: "Database delete error - error in eliminarMicroservicioById",
                    return: err
                });
            }

            return res.status(200).json({
                success: state,
                statusCode:200,
                message: `The microservice with ID_MICROSERVICIO: ${body.id_microservicio} was successfully deleted`
            });
        });
    }
}