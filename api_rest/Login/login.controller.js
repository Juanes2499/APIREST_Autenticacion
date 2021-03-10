const {
    autenticar_ByEmail,
    solicitar_cambio_contrasena,
    actualizar_contrasena
} = require('./login.service');
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const {MensajeverificarParametrosJson} = require("../../shared/verificarParametrosJson");;

module.exports ={
    login: (req, res) => {

        const body = req.body;

        autenticar_ByEmail(body, (err, internalCode, results, state) => {

            if (err) {
                return res.status(401).json({
                    success: state,
                    statusCode: 401,
                    message: err,
                    code: internalCode,
                    return: err,
                });
            }

            if (!results) {
                return res.status(401).json({
                    success: state,
                    statusCode: 401,
                    message: err,
                    code: internalCode,
                    return: err,
                });
            }

            const result = compareSync(body.password, results.PASSWORD_AUTENTICACION);

            if (result) {

                results.PASSWORD = undefined;
                result.PASSWORD_AUTENTICACION = undefined;
                result.PASSWORD_ACTIVA = undefined;
                
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
                    code:internalCode,
                    email: results.EMAIL,
                    token: jsontoken,
                    expedicion_token: fechaHoraExpedicion,
                    duracion_token: `${expiresIn/60} minutos`
                });
            } else {
                return res.status(401).json({
                    success: state,
                    statusCode: 401,
                    code: 'LOGIN_ERROR_04',
                    message: "Invalid email or password",
                });
            }
        });
    },
    solicitarCambioContrasena: (req, res) => {
        
        const body = req.body;

        const parametrosEndpoint = {  
            email: true,  
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

        solicitar_cambio_contrasena(body, (err, result, state) => {

            if(state === false){
                console.log(err);
                return res.status(403).json({
                    success: state, 
                    statusCode: 403,
                    message: "Database login error - error in solicitarCambioContrasena",
                    return: err
                });
            }

            return res.status(200).json({
                success: state,
                statusCode:200,
                message: `The email password updadte for EMAIL:  ${body.email} has been completed`
            });
        });
    },
    actualizarContrasena: (req, res) => {
        
        const body = req.body;

        const parametrosEndpoint = {  
            email: true,
            old_password: true,
            password_auth: true  
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

        actualizar_contrasena(body, (err, result, state) => {

            if(state === false){
                console.log(err);
                return res.status(403).json({
                    success: state, 
                    statusCode: 403,
                    message: "Database login error - error in actualizarContrasena",
                    return: err
                });
            }

            return res.status(200).json({
                success: state,
                statusCode:200,
                message: `The password updadte for EMAIL:  ${body.email} has been finished`
            });
        });
    },
}

