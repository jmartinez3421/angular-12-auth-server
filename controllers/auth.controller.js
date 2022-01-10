const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, resp = response) => {

    const { name, email, password } = req.body;

    try {        
        //Verificar email
        const usuario = await Usuario.findOne({ email });
        
        if(usuario){
            return resp.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese email'
            });
        }

        //Crear usuario con el Modelo
        const dbUser = new Usuario(req.body);


        //Hash a la contraseña
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync( password, salt );

        //Generar el JsonWebToken
        const token = await generarJWT(dbUser.id, name);


        //Crear usuario de DB
        await dbUser.save();

        //Generar respuesta exitosa
        return resp.status(201).json({
            ok: true,
            uid: dbUser._id,
            name,
            email,
            token
        })


    } catch (error) {
        console.log(error);
        return resp.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

};

const login = async(req, resp = response) => {

    const { email, password } = req.body;

    try{

        const dbUser = await Usuario.findOne({email});

        if(!dbUser){
            return resp.status(400).json({
                ok: false,
                msg: 'El correo no es válido'
            });
        }

        //Confirmar si el password hace match
        const validPassword = bcrypt.compareSync( password, dbUser.password );

        if(!validPassword){
            return resp.status(400).json({
                ok: false,
                msg: 'El password no es válido'
            });
        }

        //Generar el JsonWebToken
        const token = await generarJWT(dbUser.id, dbUser.name);

        //Respuesta
        return resp.status(200).json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email,
            token
        });

    }catch(error){
        console.log(error);

        return resp.status(500).json({
            ok: false,
            msg: 'Error, hable con el administrador'
        })
    }

};

const renewToken = async(req, resp) => {

    const {uid, name} = req;

    const dbUser = await Usuario.findOne({_id: uid})

    const token = await generarJWT(uid, name);
    
    return resp.json({
        ok: true,
        uid,
        name,
        email: dbUser.email,
        token
    })

};

module.exports = {
    crearUsuario,
    login,
    renewToken
}