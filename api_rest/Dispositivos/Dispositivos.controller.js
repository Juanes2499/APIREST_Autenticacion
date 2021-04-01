const {
    crear_dispositivo,  
    consultar_dispositivos,
    actualizar_dispositivo_byId,
    eliminar_dispositivo_byId,
    validar_estado_contrasena,
    actualizar_contrasena
} = require('./Dispositivos.service');
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const {MensajeverificarParametrosJson} = require("../../shared/verificarParametrosJson");

module.exports = {
    crearDispositivo: (req,res)=>{

        const body = req.body;

        const parametrosEndpoint = {
            microservicio_interes: true,
            modulo_interes: true,
            marca: true,
            referencia: true,
            latitud: true,
            longitud: true,   
            nombre_microservicio: true,
            email_responsable: true,
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
        
        crear_dispositivo(body, (err, result, state)=>{

            if(err){
                console.log(err);
                return res.status(500).json({
                    success:state,
                    statusCode:500,
                    message: "Database create error - crearDispositivo",
                    return: err
                })
            }

            return res.status(201).json({
                success: state,
                statusCode:201,
                message: `The device ${body.marca} - ${body.referencia} was created succesfully`,
              });
        });
    },
    consultarDispositivos: (req, res) => {

        const body = req.body;

        const parametrosEndpoint = {
            microservicio_interes: true,
            modulo_interes: true,
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

        consultar_dispositivos(body, (err, result, state) => {
            if (state === false) {
                console.log(err);
                return res.status(500).json({
                    success:state,
                    message: "Database get error - error in consultarDispositivos",
                    return: err
                })
            }

            result.forEach(element => {
                element.PASSWORD = undefined;
            });

            return res.status(200).json({
                success: state,
                statusCode:200,
                data: result
            });
        });
    },
    actualizarDispositivoById: (req, res) => {
        
        const body = req.body;

        const parametrosEndpoint = {
            microservicio_interes: true,
            modulo_interes: true,
            id_dispositivo: true,
            marca: true,
            referencia: true,
            latitud: true,
            longitud: true,   
            nombre_microservicio: true,  
            email_responsable: true,  
            dispositivo_activo: true,
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

        actualizar_dispositivo_byId(body, (err, result, state) => {

            if(state === false){
                console.log(err);
                return res.status(403).json({
                    success: state, 
                    statusCode: 403,
                    message: "Database put error - error in actualizarDispositivoById",
                    return: err
                });
            }

            return res.status(200).json({
                success: state,
                statusCode:200,
                message: `The device with ID_DISPOSITIVO: ${body.id_dispositivo} was successfully updated`
            });
        });
    },
    eliminarDispositivoById: (req, res) => {

        const body = req.body;

        const parametrosEndpoint = {
            microservicio_interes: true,
            modulo_interes: true,
            id_dispositivo: true,
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

        eliminar_dispositivo_byId(body, (err, result, state) => {

            if(state === false){
                return res.status(403).json({
                    success: state, 
                    statusCode: 403,
                    message: "Database delete error - error in eliminarDispositivoById",
                    return: err
                });
            }

            return res.status(200).json({
                success: state,
                statusCode:200,
                message: `The device with ID_DISPOSITIVO: ${body.id_dispositivo} was successfully deleted`
            });
        });
    },
    validarEstadoContrasena: (req, res) => {

        const body = req.body;

        const parametrosEndpoint = {
            microservicio_interes: true,
            modulo_interes: true,
            id_dispositivo: true,
            email_responsable: true,
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

        validar_estado_contrasena(body, (err, result, state) => {

            if(state === false){
                return res.status(403).json({
                    success: state, 
                    statusCode: 403,
                    message: "Database get error - error in validarEstadoContrasena",
                    return: err
                });
            }

            return res.status(200).json({
                success: state,
                statusCode: 200,
                invalidPassword: result
            });
        });
    },
    actualizarContrasena: (req, res) => {

        const body = req.body;

        const parametrosEndpoint = {
            microservicio_interes: true,
            modulo_interes: true,
            id_dispositivo: true,
            email_responsable: true,
            nombre_microservicio: true,
            old_password: true,
            password_auth: true,
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

        actualizar_contrasena(body, (err, result, state) => {

            if(state === false){
                return res.status(403).json({
                    success: state, 
                    statusCode: 403,
                    message: "Database post error - error in actualizarcontrasena",
                    return: err
                });
            }

            return res.status(200).json({
                success: state,
                statusCode:200,
                message: `The password updadte for device: ${body.id_dispositivo} has been finished`
            });
        });
    },
}