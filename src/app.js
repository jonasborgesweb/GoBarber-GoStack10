import express from 'express';
import path from 'path';
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
        this.server.use(
            '/files',
            express.static(path.resolve(__dirname, '..', 'temp', 'uploads'))
        );
    }

    routes() {
        this.server.use(routes);
    }
}

export default new App().server;
