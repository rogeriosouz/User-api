import { Request, Response } from 'express';
import Users from '../models/User';
import validator from 'email-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

type User = {
  name?: string,
  email: string,
  password: string
}

class UserController {

  async get(req: Request, res: Response): Promise<Response<User>> {
    const { email, password } = req.body as User;
    const errors: string[] = [];

    if(!email || !password) {
      errors.push('Campos invalidos!!');
    } 

    if(password.length < 5 || password.length > 50) {
      errors.push('Password Invalido de 5 a 50 caracteres!');
    }

    if(!validator.validate(email)) {
      errors.push('Email invalido!');
    }

    const emailValid = await Users.findOne({ 
      email, 
    });

    if(emailValid) {
      const passbcrip = bcrypt.compareSync(password, emailValid.password)
      if(!passbcrip) {
        errors.push('Campos invalidos!!');
      }
    }  else {
      errors.push('Campos invalidos!!');
    }

    if(errors.length > 0) {
      return res.status(401).json({ Errors: errors })
    }

    const token = jwt.sign({ userId: emailValid?._id }, process.env.SECRET as string,
      { 
        expiresIn: process.env.TOKEN_DAYS 
      })

    return res.json({ token, user: { 
      name: emailValid?.name,
      email: emailValid?.email
    }});

  }

  async post(req: Request, res: Response): Promise<Response<User, Record<string, User>> | undefined> {
    const { name, email, password } = req.body as User;

    const errors = [];

    if(!name || !email || !password) {
      errors.push('Campos invalidos!');
    } else {
      if(name.length < 2 || name.length > 50) {
        errors.push('Name Invalido de 2 a 50 caracteres!');
      }
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

      const usDb = await Users.findOne({ email });
      const token = jwt.sign({ userId: usDb?._id }, process.env.SECRET as string,
        { 
          expiresIn: process.env.TOKEN_DAYS 
        })

      return res.json({ token, user: { 
        name: usDb?.name,
        email: usDb?.email
      }});

    } catch (error) {
      console.log(errors);
    }   
  }


  async update(req: any, res: Response) {
    const userId = req.userId;
    const user = await Users.findOne({ userId });

    const errors: string[] = [];

    const { name, email, password }: User = req.body
    
    if(!name || !email || !password) {
      return res.status(401).json({ Errors: 'Campos vazios!' })
    } else {
      if(name.length < 2 || name.length > 50) {
        errors.push('Name Invalido de 2 a 50 caracteres!');
      }
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

    const users = {
      name,
      email, 
      password: bcrypt.hashSync(password, 10)
    }
    await Users.updateOne({ user }, users)
    res.json(users)
  }

  async recorverInfomationUser(req: any, res: Response) {
    const userId = req.userId;
    const user = await Users.findOne({ userId })

    return res.json(user)
  }

}

export default new UserController();