const {
    crear_Usuario, 
    consultar_Usuarios, 
    consultar_usuarios_byID, 
    consultar_usuarios_byEmail,
    actualizar_usuario_byId,
    eliminar_usuario_byId,
    autenticar_ByEmail,
} = require('./usuarios.service');
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const {MensajeverificarParametrosJson} = require("../../shared/verificarParametrosJson");

module.exports = {
    crearUsuario: (req,res)=>{

        const body = req.body;

        const parametrosEndpoint = {
            nombres: true,
            apellidos: true,
            tipo_doc_id: true,
            numero_doc_id: true,   
            email: true,  
            password: true,  
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
        
        const salt = genSaltSync(10);
        
        const encriptPass = new Promise((resolve, reject)=>{
            body.password = hashSync(body.password,salt)
            resolve()
        })

        encriptPass
            .then()
            .catch((err)=>{
                console.log(err);
            });
        
        crear_Usuario(body, (err, result, state)=>{
            if(err){
                console.log(err);
                return res.status(500).json({
                    success:state,
                    statusCode:500,
                    message: "Database create error - crearUsuario",
                    return: err
                })
            }
            return res.status(201).json({
                success: state,
                statusCode:201,
                message: `The register with email: ${body.email} was successfully created`,
              });
        });
    },
    consultarUsuarios: (req, res) => {

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

        consultar_Usuarios(body, (err, result, state) => {
            if (state === false) {
                console.log(err);
                return res.status(500).json({
                    success:state,
                    message: "Database get error - error in consultarUsuarios",
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
    actualizarUsuarioById: (req, res) => {
        
        const body = req.body;

        const parametrosEndpoint = {
            id_usuario: true,
            nombres: true,
            apellidos: true,
            tipo_doc_id: true,
            numero_doc_id: true,   
            email: true,  
            password: true,  
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

        const salt = genSaltSync(10);
        
        const encriptPass = new Promise((resolve, reject)=>{
            body.password = hashSync(body.password,salt)
            resolve()
        })
        encriptPass
            .then()
            .catch((err)=>{
                console.log(err);
            });

        actualizar_usuario_byId(body, (err, result, state) => {

            if(state === false){
                console.log(err);
                return res.status(403).json({
                    success: state, 
                    statusCode: 403,
                    message: "Database put error - error in actualizarUsuarioById",
                    return: err
                });
            }

            return res.status(200).json({
                success: state,
                statusCode:200,
                message: `The user with ID_USUARIO: ${body.id_usuario} was successfully updated`
            });
        });
    },
    eliminarUsuarioById: (req, res) => {

        const body = req.body;

        const parametrosEndpoint = {
            id_usuario: true,
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

        eliminar_usuario_byId(body, (err, result, state) => {

            if(state === false){
                return res.status(403).json({
                    success: state, 
                    statusCode: 403,
                    message: "Database delete error - error in eliminarUsuarioById",
                    return: err
                });
            }

            return res.status(200).json({
                success: state,
                statusCode:200,
                message: `The user with ID_USUARIO: ${body.id_usuario} was successfully deleted`
            });
        });
    },
}