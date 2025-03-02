import passport from "passport";
import local from 'passport-local';
import { Strategy as JwtStrategy } from 'passport-jwt';
import userModel from "../modules/user.model.js";
import { createHash, validatePassword } from "../utils/bcrypt.js";

const JWT_SECRET = '1234567890';

// Función que obtiene el token desde la cookie "jwtCookie"
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwtCookie'];
  }
  return token;
};

// Opciones para la estrategia "current"
const optsCurrent = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: JWT_SECRET
};

const localStrategy = local.Strategy;

const initializatePassport = () => {
  // Estrategia para registrar un usuario
  passport.use('register', new localStrategy(
    { passReqToCallback: true, usernameField: 'email' },
    async (req, username, password, done) => {
      try {
        const { first_name, last_name, email, age } = req.body;
        // Buscar si ya existe el usuario
        let user = await userModel.findOne({ email: username });
        if (user) {
          console.log("User already exists");
          return done(null, false);
        }
        // Verificar que se hayan enviado todos los campos requeridos
        if (!first_name || !last_name || !email || !password || !age) {
          return done(null, false);
        }
        // Crear el usuario con la contraseña hasheada
        const newUser = await userModel.create({
          first_name,
          last_name,
          email,
          password: createHash(password),
          age
        });
        return done(null, newUser);
      } catch (e) {
        return done(e);
      }
    }
  ));

  // Estrategia para el login de usuario
  passport.use('login', new localStrategy(
    { usernameField: 'email' },
    async (username, password, done) => {
      try {
        const user = await userModel.findOne({ email: username });
        if (!user) {
          console.log("User doesn't exist");
          return done(null, false);
        }
        if (!validatePassword(password, user.password)) {
          return done(null, false);
        }
        return done(null, user);
      } catch (e) {
        return done(e);
      }
    }
  ));

  // Estrategia "current" que extrae el token desde la cookie y obtiene el usuario
  passport.use('current', new JwtStrategy(optsCurrent, async (jwt_payload, done) => {
    try {
      const user = await userModel.findById(jwt_payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false, { message: 'Token no válido o usuario inexistente' });
    } catch (error) {
      return done(error, false);
    }
  }));

  // Serialización y deserialización de usuario
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
};

export default initializatePassport;
