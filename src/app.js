import express from 'express';
import routes from './routes';

// Importando o Banco de Dados
import './database';

class App {
    constructor() {
        this.server = express();

        // Inicializando as Funções
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(express.json());
    }

    routes() {
        this.server.use(routes);
    }
}

export default new App().server;
