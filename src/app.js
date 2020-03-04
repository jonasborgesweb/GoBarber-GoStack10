import 'dotenv/config';
import express from 'express';
import * as Sentry from '@sentry/node';
import Youch from 'youch';
import path from 'path';
import 'express-async-errors';
import sentryConfig from './config/sentry';
import routes from './routes';

// Importando o Banco de Dados
import './database';

class App {
    constructor() {
        this.server = express();

        Sentry.init(sentryConfig);

        // Inicializando as Funções
        this.middlewares();
        this.routes();
        this.exceptionHandler();
    }

    middlewares() {
        this.server.use(Sentry.Handlers.requestHandler());
        this.server.use(express.json());
        this.server.use(
            '/files',
            express.static(path.resolve(__dirname, '..', 'temp', 'uploads'))
        );
    }

    routes() {
        this.server.use(routes);
        this.server.use(Sentry.Handlers.errorHandler());
    }

    exceptionHandler() {
        this.server.use(async (err, req, res, next) => {
            if (process.env.NODE_ENV === 'development') {
                const errors = await new Youch(err, req).toJSON();

                return res.status(500).json(errors);
            }
            return res.status(500).json({ error: 'Internal server Error!' });
        });
    }
}

export default new App().server;
