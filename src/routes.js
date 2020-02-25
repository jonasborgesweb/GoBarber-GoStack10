import { Router } from 'express';

// Importando as Controllers
import UserController from './app/controllers/UserController';

const routes = new Router();

routes.post('/users', UserController.store);

export default routes;
