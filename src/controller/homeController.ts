import { Request, Response } from 'express';

class HomeController {
  public get(req: Request, res: Response): void {
    res.send('<h1>Hello World</h1>')
  }
}

export default new HomeController();