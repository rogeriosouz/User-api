import jwt from 'jsonwebtoken';
import { Response, NextFunction, } from 'express'; 

const ferifica = async (req: any, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];
  if(!token) {
    return res.status(401).json({ Errors: 'Token nao enviado!' })
  }

  jwt.verify(token as string, process.env.SECRET as string, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ Errors: 'Token invalido!' });
    } else {
      req.userId = decoded.userId;
      next();
    }
  })
}

export default ferifica;