import Sequelize, { Model } from 'sequelize';

// Importando Bcrypt para gerar o Hash da Senha
import bcrypt from 'bcryptjs';

class User extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                password: Sequelize.VIRTUAL,
                password_hash: Sequelize.STRING,
                provider: Sequelize.BOOLEAN,
            },
            {
                sequelize,
            }
        );

        // Configurando o HASH da Senha
        this.addHook('beforeSave', async user => {
            if (user.password) {
                user.password_hash = await bcrypt.hash(user.password, 8);
            }
        });

        return this;
    }

    // Função para Checar se as Senhas são Iguais
    checkPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }

    // Método Associate
    static associate(models) {
        this.belongsTo(models.File, { foreignKey: 'avatar_id' });
    }
}

export default User;
