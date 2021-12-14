const pool = require("../config/database");
const jwt = require("jsonwebtoken");

const auth = async(req, res, next) => {

    try {
        
        if(!req.headers.authorization){
            return res.status(500).json({
                success:false,
                statusCode:500,
                message: "There is no token"
            })  
        }

        const token = req.headers.authorization.replace('Bearer ', '');
        const key = process.env.TOKEN_KEY.toString();

        jwt.verify(token, key, (err, decoded) => {      
            if (err) {
                return res.status(500).json({
                    success:false,
                    statusCode:500,
                    message: "Invalid token"
                })  
            } else {

                const queryConsultarPermisosMicroservicios = `
                    SELECT COUNT(*) CANTIDAD FROM CONFIGURACION_USUARIOS WHERE EMAIL = ? AND NOMBRE_MICROSERVICIO = ? 
                `

                pool.query(
                    queryConsultarPermisosMicroservicios,
                    [decoded.EMAIL, req.body.nombre_microservicio],
                    (error, result) => {

                        if (error){
                            return callback(`There is/are error(s), please contact with the administrator`, false);
                        }

                        if (result > 0){
                            return callback(null, false);
                        }else if (result === 0){
                            return callback(`The user with EMAIL: ${email} is not able to creat, read, modify or delete a device for the microservice: ${nombre_microservicio}.`, false);
                        }
                    }
                )
                req.decoded = decoded;
            }
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            statusCode:500,
            message: "Token error"
        })
    }
}

module.exports = auth