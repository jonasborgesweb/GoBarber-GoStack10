import { Router } from 'express';

// Importando o Multer
import multer from 'multer';

// Importando as Configuraçoes de Uploads
import multerConfig from './config/multer';

// Importando as Controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

// Importando Middlewares
import authMiddlewares from './app/middlewares/auth';

const routes = new Router();

// Criando o Upload
const upload = multer(multerConfig);

// Rota de Login
routes.post('/sessions', SessionController.store);

// Rota de Criação de Usuáriodadsadasdas
routes.post('/users', UserController.store);

// Adicionando Middleware de Authentication
routes.use(authMiddlewares);
// Rota de Edição de Usuário
routes.put('/users', UserController.update);

// Rota de update
routes.post('/files', upload.single('file'), (req, res) => {
    return res.json({ ok: true });
});

export default routes;
