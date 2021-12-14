const {
    crear_rol,
    consultar_rolesDinamico,
    eliminar_rol_ByID,
} = require('./roles.service');
const {MensajeverificarParametrosJson} = require("../../shared/verificarParametrosJson");

module.exports = {
    crearRol: (req, res) => {
        
        const body = req.body;

        const parametrosEndpoint = {
            nombre_rol: true,
            detalles: true,
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
        
        crear_rol(body, (err, result, state)=>{
            if(err){
                console.log(err);
                return res.status(500).json({
                    success:state,
                    statusCode:500,
                    message: "Database create error - crearRol",
                    return: err
                })
            }
            return res.status(201).json({
                success: state,
                statusCode:201,
                message: `The register with NOMBRE_ROL: ${body.nombre_rol} was successfully created`,
              });
        });
    },
    consultarRolesDinamico: (req, res) => {
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

        consultar_rolesDinamico(body, (err, result, state) => {
            if (state === false) {
                console.log(err);
                return res.status(500).json({
                    success:state,
                    message: "Database get error - error in consultarRolesDinamico",
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
    eliminarRolByID: (req, res) => {
        const body = req.body;

        const parametrosEndpoint = {
            id_rol: true,
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

        eliminar_rol_ByID(body, (err, result, state) => {

            if(state === false){
                return res.status(403).json({
                    success: state, 
                    statusCode: 403,
                    message: "Database delete error - error in eliminarRolByID",
                    return: err
                });
            }

            return res.status(200).json({
                success: state,
                statusCode:200,
                message: `The microservice with ID_ROL: ${body.id_rol} was successfully deleted`
            });
        });
    }
}