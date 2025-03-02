import { Router } from "express";
import passport from "passport";
import { login, register, current } from "../controllers/session.controller.js";
import { generateToken } from "../utils/jwt.js";

const sessionsRouter = Router()

// sessionsRouter.post('/login', passport.authenticate('login', {failureRedirect : 'faillogin'}), login)
sessionsRouter.post('/login', passport.authenticate('login', { session: false, failureRedirect : 'faillogin' }), login);

sessionsRouter.get('/faillogin', (req, res) => {
res.status(401).json({ error: 'Failed login' });
});

// sessionsRouter.get('/faillogin', async (req, res) =>{
//   res.send({error : 'Failed login'});
// });

// sessionsRouter.post('/register', passport.authenticate("register", {failureRedirect: '/failregister'}), register)


// sessionsRouter.get('/failregister', async (req, res) =>{
  //   console.log('Fail Strategy');
  //   res.send({error : 'Fail'});
  // });
  sessionsRouter.post('/register', passport.authenticate("register", { session: false, failureRedirect: '/failregister'}), register);
  
  
sessionsRouter.get('/failregister', (req, res) => {
    res.status(400).json({ error: 'Fail register' });
  });

 
sessionsRouter.get('/current', passport.authenticate('current', { session: false }), current);


export default sessionsRouter