const { Router } = require('express');
const { check } = require('express-validator');
const { _crearUsuario, _loginUsuario, _revalidarToken } = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


//crear nuevo usuario
/*router.post('/new', (req, res)=>{
    return res.json({
        ok: true,
        msg: 'Crear usuario /new'
    });
});
*/
/*
router.post('/new', _crearUsuario);
*/
router.post('/new', [
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('email','El email es obligatorio').isEmail(),
    check('password','La contraseña es obligatoria').isLength({min:6}),
    validarCampos
], _crearUsuario);



// Login de usuario
/*
router.post('/', (req, res)=>{
    return res.json({
        ok: true,
        msg: 'Login de usuario /'
    });
});
*/
/*
router.post('/', _loginUsuario);
*/
router.post('/', [ // aqui iran ahora los middleware
    check('email','El email es obligatorio').isEmail(),
    check('password','La contraseña es obligatoria').isLength({min:6}),
    validarCampos
],_loginUsuario);




// Validar y revalidar token
/*
router.get('/renew', (req, res)=>{
    return res.json({
        ok: true,
        msg: 'Renew'
    });
});
*/
/*
router.get('/renew', _revalidarToken);
*/

router.get('/renew',[ validarJWT ], _revalidarToken); //el middleware podria ir sin los corchetes por ser uno solo

module.exports = router;