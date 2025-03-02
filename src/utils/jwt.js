import jwt from 'jsonwebtoken';

const secretKey = "1234567890";

export const generateToken = (user) => {
   const token = jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: '24h' });
   return token;
}

export const authToken = (req, res, next) => {
   const authHeader = req.headers.authorization;
   if (!authHeader) {
      return res.status(401).send({ error: 'Not authenticated' });
   }

   const token = authHeader.split(' ')[1];
   jwt.verify(token, secretKey, (error, payload) => {
      if (error) {
         return res.status(403).send({ error: 'Not authenticated' });
      }
      // Como firmamos directamente con id y email, asignamos el payload a req.user
      req.user = payload;
      next();
   });
}
