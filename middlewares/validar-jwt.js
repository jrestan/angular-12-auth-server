const { request, response } = require("express");
const jwt = require('jsonwebtoken');

const validarJWT = (req= request, res= response, next) => {

    const xtoken = req.header('x-token');
    
    if(!xtoken){
        return res.status(401).json({
            ok: false,
            msg: 'Error en el token'
        });
    }

    try {

        const {uid, name} = jwt.verify(xtoken, process.env.SECRET_JWT_SEED);

        console.log(uid, name);

        //con esto a req se le esta agregando estas dos propiedades con el fin de que pase de esta middleware a la funcion que hace la llamada.
        req.uid = uid;
        req.name = name;
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });
    }

    //TODO ok!
    next();
}

module.exports = {
    validarJWT
}