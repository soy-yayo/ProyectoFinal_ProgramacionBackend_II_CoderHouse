import express from 'express'
import mongoose from "mongoose"
import cookieParser from 'cookie-parser'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import session from 'express-session'
import FileStore from 'session-file-store'
import usersRouter from "./routes/user.routes.js"
import sessionsRouter from './routes/session.router.js'
import initializatePassport from './config/passport.js'

const fileStorage = FileStore(session)
const app = express()
const PORT = 8080

app.use(express.json())
app.use(cookieParser())
app.use(session({
    store : MongoStore.create({
        mongoUrl: 'mongodb+srv://elyayo:1234567890@proyectofinalcoderhouse.15zxz.mongodb.net/?retryWrites=true&w=majority&appName=proyectoFinalCoderhouse',
        ttl : 15
    }),
    secret: "1234567890",
    resave: false,
    saveUninitialized: false
}))

app.post('/api/sessions/logout', (req, res) => {
    // Limpia la cookie del JWT
    res.clearCookie('jwtCookie', { path: '/' });
    // Limpia la cookie de la sesión, si la usas
    res.clearCookie('connect.sid', { path: '/' });
    return res.status(200).json({ message: 'Cookies eliminadas correctamente' });
  });

initializatePassport() 
app.use(passport.initialize())
app.use(passport.session())

mongoose.connect("mongodb+srv://elyayo:1234567890@proyectofinalcoderhouse.15zxz.mongodb.net/?retryWrites=true&w=majority&appName=proyectoFinalCoderhouse")
.then(() => console.log("DB is connected"))
.catch((e) => console.log(e))


app.use('/api/users', usersRouter)
app.use('/api/sessions', sessionsRouter)

app.listen(PORT, () => {
    console.log("Listening on port: " + PORT)
})