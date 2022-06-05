import Router from 'express';
import homeController from './controller/homeController';
import userController from './controller/userController';

const routers = Router();

// home
routers.get('/', homeController.get);

// User
routers.get('/user/login', userController.get);
routers.post('/user/register', userController.post);
routers.put('/user/update', userController.update);


export default routers;