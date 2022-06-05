import { Request, Response } from 'express';
import Users from '../models/User';
import validator from 'email-validator';
import bcrypt from 'bcrypt';

type User = {
  name: string,
  email: string,
  password: string
}

class UserController {

  async get(req: Request, res: Response): Promise<Response<User>> {
    const users = await Users.find();
    return res.json({ users });
  }

  async post(req: Request, res: Response): Promise<Response<User, Record<string, User>> | undefined> {
    const { name, email, password } = req.body as User;

    const errors = [];

    if(!name || !email || !password) {
      errors.push('Campos invalidos!');
    }

    if(name.length < 2 || name.length > 50) {
      errors.push('Name Invalido de 2 a 50 caracteres!');
    }

    if(password.length < 5 || password.length > 50) {
      errors.push('Password Invalido de 5 a 50 caracteres!');
    }

    if(!validator.validate(email)) {
      errors.push('Email invalido!');
    }

    const EmailDb = await Users.findOne({ email });
    if (EmailDb) {
      errors.push('Email ja esiste!');
    }
    
    if(errors.length > 0) {
      return res.status(401).json({ Errors: errors })
    }

    try {
      const user: User = { 
        name, 
        email, 
        password: bcrypt.hashSync(password, 10)
      } 

      await Users.create(user);
      return res.json({ user });

    } catch (error) {
      console.log(errors);
    }   
  }

  update(req: Request, res: Response): void {
    res.json({ update: 'true' })
  }

}

export default new UserController();