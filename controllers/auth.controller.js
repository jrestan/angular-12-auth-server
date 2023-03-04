const { response, request } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
//const { validationResult } = require('express-validator');


const crearUsuario = async (req = request, res = response)=>{

    console.log('Crear usuario request', req.body);

    const {name, email, password} = req.body;
    console.log('Crear usuario request desestructurado', name, email, password);

    try {
        //Verificar el email
        const usuario = await Usuario.findOne({ email });  //no hace falta ponerle {email: email} por la version del ECMAScript q permite simplificar
        
        if(usuario){
            
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese email'
            });
        }

        //Crear usuario con el modelo
        const dbUser = new Usuario( req.body );

        //Hashear la contraseña
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync( password, salt);
    
        //Generar el JWT
        const token = await generarJWT(dbUser.id, name);

        //Crear usuario de BD
        await dbUser.save();
            
        //Generar respuesta exitosa
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

    
}


const loginUsuario = async (req, res = response)=>{

    /* //Ya no va aqui, ahora va en validarCampos....
    const errors = validationResult( req );
    console.log(errors);

    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        });
    }*/

    const {email, password} = req.body;
    console.log('Login request desestructurado', email, password);
    
    try {

        const dbUser = await Usuario.findOne({email});

        if(!dbUser){
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'  //el mensaje deberia ser usuario y/o contraseña invalidos
            });
        }

        //confirmmar si el password hace match
        const validPassword = bcrypt.compareSync(password, dbUser.password);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'El password no es valido'
            });
        }

        //Generar el JWT
        const token = await generarJWT(dbUser.id, dbUser.name);

        //respuesta del servicio
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            token
        });

        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
    

}

const revalidarToken = async (req = request, res = response)=>{

    /*
    const xtoken = req.header('x-token');
    
    if(!xtoken){
        return res.status(401).json({
            ok: false,
            msg: 'Error en el token'
        });
    }*/

    const {uid, name} = req; //con esto se desestructura las propiedades agregadas a req dentro del middleware validar-jwt

    //Generar un nuevo JWT
    const token = await generarJWT(uid, name);

    return res.json({
        ok: true,
        uid,
        name,
        token
    });
}


module.exports = {
    _crearUsuario: crearUsuario,
    _loginUsuario: loginUsuario,
    _revalidarToken: revalidarToken
}