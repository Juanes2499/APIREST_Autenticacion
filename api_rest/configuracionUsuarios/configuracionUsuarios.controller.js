const {
    crear_configuracionUsuarios,
    consultar_configuracionUsuario_dinamico,
    eliminar_configuracionUsuario_ByID,
} = require('./configuracionUsuarios.service');
const {MensajeverificarParametrosJson} = require("../../shared/verificarParametrosJson");

module.exports = {
    crearConfiguracionUsuarios: (req,res)=>{

        const body = req.body;

        const parametrosEndpoint = {
            email: true,
            nombre_microservicio: true,
            nombre_modulo: true,
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
        
        crear_configuracionUsuarios(body, (err, result, state)=>{

            if(state === false){
                console.log(err);
                return res.status(500).json({
                    success:state,
                    statusCode:500,
                    message: "Database create error - crearConfiguracionUsuarios",
                    return: err
                })
            }

            return res.status(201).json({
                success: state,
                statusCode:201,
                message: `The register with EMAIL: ${body.email} and NOMBRE_MICROSERVICIO: ${body.nombre_microservicio} and NOMBRE_MODULO: ${body.nombre_modulo} was successfully created`,
              });
        });
    },
    consultarConfiguracionUsuarioDinamico: (req, res) => {

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

        consultar_configuracionUsuario_dinamico(body, (err, result, state) => {
            if (state === false) {
                console.log(err);
                return res.status(500).json({
                    success:state,
                    message: "Database get error - error in consultarConfiguracionUsuarioDinamico",
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
    eliminarConfiguracionUsuarioByID: (req, res) => {

        const body = req.body;

        const parametrosEndpoint = {
            id_configuracion_usuario: true,
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

        eliminar_configuracionUsuario_ByID(body, (err, result, state) => {

            if(state === false){
                return res.status(403).json({
                    success: state, 
                    statusCode: 403,
                    message: "Database delete error - error in eliminarConfiguracionUsuarioByID",
                    return: err
                });
            }

            return res.status(200).json({
                success: state,
                statusCode:200,
                message: `The user configuration with ID_CONFIGURACION_USUARIO: ${body.id_configuracion_usuario} was successfully deleted`
            });
        });
    }
}