const {
    crear_configuracioMicroservicioModulo,
    consultar_configuracioMicroservicioModulo_dinamico,
    eliminar_configuracioMicroservicioModulo_ByID
} = require('./configuracionMicroservicioModulo.service');
const {MensajeverificarParametrosJson} = require("../../shared/verificarParametrosJson");

module.exports = {
    crearConfiguracioMicroservicioModulo: (req,res)=>{

        const body = req.body;

        const parametrosEndpoint = {
            nombre_microservicio: true,
            nombre_modulo: true,
        };
        
        const arrayParametrosJsonComparar = Object.keys(body);
        
        const verificarParametro = MensajeverificarParametrosJson(parametrosEndpoint, arrayParametrosJsonComparar)

        if(verificarParametro.error === true || verificarParametro.messageFaltantes != null || verificarParametro.messageMalEscritos != null ){
            
            const errorData = {
                mensaje_retornado: `${verificarParametro.messageFaltantes}, please set a all required parameters`
            }

            return res.status(500).json({
                success: false,
                statusCode: 500,
                message: errorData.mensaje_retornado
            })
        }
        
        crear_configuracioMicroservicioModulo(body, (err, result, state)=>{
            if(state === false){
                console.log(err);
                return res.status(500).json({
                    success:state,
                    statusCode:500,
                    message: "Database create error - crearConfiguracioMicroservicioModulo",
                    return: err
                })
            }

            return res.status(201).json({
                success: state,
                statusCode:201,
                message: `The register with NOMBRE_MICROSERVICIO ${body.nombre_microservicio} and NOMBRE_MODULO: ${body.nombre_modulo} was successfully created`,
              });
        });
    },
    consultarConfiguracioMicroservicioModuloDinamico: (req, res) => {

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
                mensaje_retornado: `${verificarParametro.messageFaltantes}, please set a all required parameters`
            }

            return res.status(500).json({
                success: false,
                statusCode: 500,
                message: errorData.mensaje_retornado
            })
        }

        consultar_configuracioMicroservicioModulo_dinamico(body, (err, result, state) => {
            if (state === false) {
                console.log(err);
                return res.status(500).json({
                    success:state,
                    message: "Database get error - error in consultarConfiguracioMicroservicioModuloDinamico",
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
    eliminarConfiguracioMicroservicioModuloByID: (req, res) => {

        const body = req.body;

        const parametrosEndpoint = {
            id_configuracion: true,
        };
        
        const arrayParametrosJsonComparar = Object.keys(body);
        
        const verificarParametro = MensajeverificarParametrosJson(parametrosEndpoint, arrayParametrosJsonComparar)

        if(verificarParametro.error === true || verificarParametro.messageFaltantes != null || verificarParametro.messageMalEscritos != null ){
            
            const errorData = {
                mensaje_retornado: `${verificarParametro.messageFaltantes}, please set a all required parameters`
            }

            return res.status(500).json({
                success: false,
                statusCode: 500,
                message: errorData.mensaje_retornado
            })
        }

        eliminar_configuracioMicroservicioModulo_ByID(body, (err, result, state) => {

            if(state === false){
                return res.status(403).json({
                    success: state, 
                    statusCode: 403,
                    message: "Database delete error - error in eliminarConfiguracioMicroservicioModuloByID",
                    return: err
                });
            }

            return res.status(200).json({
                success: state,
                statusCode:200,
                message: `The microservice module configuration with ID_CONFIGURACION: ${body.id_configuracion} was successfully deleted`
            });
        });
    }
}