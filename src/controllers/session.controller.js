import { generateToken } from "../utils/jwt.js";

export const register = async (req, res) => {
    try {
        console.log(req.user);
        if (!req.user)
            return res.status(400).send("Todos los atributos son necesarios")
        return res.status(201).send(`Usuario creado correctamente con el id: ${req.user?._id}`)
    } catch (e) {
        res.status(500).send(e)
    }
}

export const current = async (req, res) => {
    try{
    console.log(req.user);

    res.json({
        status: 'success',
        user: req.user
    });
    } catch(e){
        res.status(500).send(e);
    }
}
    
// export const login = async (req,res) => {
//     try {
//         if(!req.user._id)
//             return res.status(400).send("Usuario o contraseña no validos")

//         req.session.user = {
//             email: req.user.email,
//             password  : req.user.password
//         }
//         return res.send({status : 'success', payload : req.user});
//     } catch(e) {
//         res.status(500).send(e)
//     }
// }

export const login = async (req, res) => {
    if (!req.user) return res.status(400).json({ error: "Credenciales inválidas" });

    // Generamos el token JWT
    const token = generateToken(req.user);

    // Guardamos el token en la cookie "jwtCookie"
    res.cookie('jwtCookie', token, {
        maxAge: 60 * 60 * 1000
    });

    return res.status(200).json({ token: token });
}