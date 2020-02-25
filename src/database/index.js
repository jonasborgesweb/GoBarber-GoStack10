import Sequelize from 'sequelize';

// Importando as Configurações do Banco de Dados
import databaseConfig from '../config/database';

// Importando os models
import User from '../app/models/User';

// Construindo um Array com todas as Models
const models = [User];

class Database {
    constructor() {
        this.init();
    }

    init() {
        // Criando a conexão com o Banco de Dados
        this.connection = new Sequelize(databaseConfig);

        // Criando o Loader de Models
        models.map(model => model.init(this.connection));
    }
}

export default new Database();
