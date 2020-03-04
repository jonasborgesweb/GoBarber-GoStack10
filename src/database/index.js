import Sequelize from 'sequelize';

// Importando o Mongoose
import mongoose from 'mongoose';

// Importando as Configurações do Banco de Dados
import databaseConfig from '../config/database';

// Importando os models
import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

// Construindo um Array com todas as Models
const models = [User, File, Appointment];

class Database {
    constructor() {
        this.init();
        this.mongo();
    }

    init() {
        // Criando a conexão com o Banco de Dados
        this.connection = new Sequelize(databaseConfig);

        // Criando o Loader de Models
        models
            .map(model => model.init(this.connection))
            .map(
                model =>
                    model.associate && model.associate(this.connection.models)
            );
    }

    mongo() {
        // Criando a conexão com o MongoDB
        this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useFindAndModify: true,
            useUnifiedTopology: true,
        });
    }
}

export default new Database();
