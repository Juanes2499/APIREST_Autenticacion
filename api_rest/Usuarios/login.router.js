const {
    login
} = require('./usuarios.controller');
const router = require('express').Router();

router.post("/", login);
    
module.exports = router;