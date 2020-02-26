import { Router } from 'express';

// Importando o Multer
import multer from 'multer';

// Importando as Configuraçoes de Uploads
import multerConfig from './config/multer';

// Importando as Controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';

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
routes.post('/files', upload.single('file'), FileController.store);

// Rota de Listagem de Providers
routes.get('/providers', ProviderController.index);

// Rota de Agendamento
routes.post('/appointments', AppointmentController.store);

// Rota de Listagem de Agendamento
routes.get('/appointments', AppointmentController.index);
export default routes;
