import { Router } from 'express';

// Importando as Controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

// Importando Middlewares
import authMiddlewares from './app/middlewares/auth';

const routes = new Router();

// Rota de Login
routes.post('/sessions', SessionController.store);

// Rota de Criação de Usuáriodadsadasdas
routes.post('/users', UserController.store);

// Adicionando Middleware de Authentication
routes.use(authMiddlewares);
// Rota de Edição de Usuário
routes.put('/users', UserController.update);

export default routes;
