var ExtractJwt = require('passport-jwt').ExtractJwt;
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

