const {
    crear_Usuario, 
    consultar_Usuarios, 
    consultar_usuarios_byID, 
    consultar_usuarios_byEmail,
    actualizar_usuario_byId,
    eliminar_usuario_byId,
    autenticar_ByEmail,
} = require('./user.service');
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
require("dotenv").config()

module.exports = {
    crearUsuario: (req,res)=>{

        const body = req.body;
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
                statusCode:201
              });
        });
    },
    consultarUsuarios: (req, res) => {
        consultar_Usuarios((err, result, state) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success:state,
                    message: "Database get error - error in consultarUsuarios"
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
    consultarUsuariosByID: (req, res)=>{
        const body = req.body;
        consultar_usuarios_byID(body, (err, result, state) => {
            if (err) {
                return res.status(500).json({
                    success:state,
                    message: "Database get error - error in consultarUsuariosByID",
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
    consultarUsuariosByEmail: (req, res)=>{
        const body = req.body;

        consultar_usuarios_byEmail(body, (err, result, state) => {
            if (err) {
                return res.status(500).json({
                    success:state,
                    message: "Database get error - error in consultarUsuariosByEmail",
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
                message: `The user with ID_USER: ${body.id_user} was successfully updated`
            });
        });
    },
    eliminarUsuarioById: (req, res) => {
        const body = req.body;
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
                message: `The user with ID_USER: ${body.id_user} was successfully deleted`
            });
        });
    },
    login: (req, res) => {
        const body = req.body;
        autenticar_ByEmail(body, (err, results, state) => {
            if (err) {
                console.log(err);
            }

            if (!results) {
                return res.status(500).json({
                    success: state,
                    statusCode: 500,
                    message: "Invalid email",
                    return: err,
                });
            }

            const result = compareSync(body.password, results.PASSWORD);

            if (result) {

                results.PASSWORD = undefined;
                
                const payloald = results;

                const key = process.env.TOKEN_KEY.toString();
                const expiresIn = parseInt(process.env.TOKEN_EXPIRE_IN);

                const jsontoken = sign(payloald, key, {
                    expiresIn: expiresIn,
                });

                let date =  new Date();
                let anoExpedicion = date.getFullYear();
                let mesExpedicion = date.getMonth()+1;
                let diaExpedicion = date.getDate();
                let horaExpedicion = date.getHours();
                let minutosExpedicion = date.getMinutes();

                if(minutosExpedicion.toString().length === 1){
                    minutosExpedicion = `0${minutosExpedicion}`;
                }

                let fechaHoraExpedicion = `${anoExpedicion}/${mesExpedicion}/${diaExpedicion} - ${horaExpedicion}:${minutosExpedicion}`;

                return res.json({
                    success: state,
                    statusCode:200,
                    message: "login successfully",
                    nombre: results.NOMBRES,
                    apellido: results.APELLIDOS,
                    token: jsontoken,
                    expedicion_token: fechaHoraExpedicion,
                    duracion_token: `${expiresIn/60} minutos`
                });
            } else {
                return res.status(500).json({
                    success: state,
                    statusCode: 500,
                    message: "Invalid email or password",
                });
            }
        });
      },
}