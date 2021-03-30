const {
    crear_dispositivo,  
    consultar_dispositivos,
    actualizar_dispositivo_byId,
    eliminar_dispositivo_byId
} = require('./Dispositivos.service');
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const {MensajeverificarParametrosJson} = require("../../shared/verificarParametrosJson");

module.exports = {
    crearDispositivo: (req,res)=>{

        const body = req.body;

        const parametrosEndpoint = {
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

        const salt = genSaltSync(10);
        
        if(body.password !== null){
            const encriptPass = new Promise((resolve, reject)=>{
                body.password = hashSync(body.password,salt)
                resolve()
            })
            encriptPass
                .then()
                .catch((err)=>{
                    console.log(err);
                });
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
}