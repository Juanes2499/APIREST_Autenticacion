const {
    autenticar_ByEmail
} = require('./login.service');
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const {MensajeverificarParametrosJson} = require("../../shared/verificarParametrosJson");

module.exports ={
    login: (req, res) => {
        const body = req.body;
        autenticar_ByEmail(body, (err, results, state) => {

            if (err) {
                return res.status(401).json({
                    success: state,
                    statusCode: 401,
                    message: "Invalid email",
                    return: err,
                });
            }

            if (!results) {
                return res.status(401).json({
                    success: state,
                    statusCode: 401,
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
                    email: results.EMAIL,
                    token: jsontoken,
                    expedicion_token: fechaHoraExpedicion,
                    duracion_token: `${expiresIn/60} minutos`
                });
            } else {
                return res.status(401).json({
                    success: state,
                    statusCode: 401,
                    message: "Invalid email or password",
                });
            }
        });
    },
}