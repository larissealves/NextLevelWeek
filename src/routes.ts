import express from 'express';
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionController';

const routes = express.Router();
const classControllers = new ClassesController();
const classConnectionControler = new ConnectionsController();

routes.post('/classes', classControllers.create);
routes.get('/classes', classControllers.index);

routes.post('/connections', classConnectionControler.create);
routes.get('/connections', classConnectionControler.index);

export default routes;
