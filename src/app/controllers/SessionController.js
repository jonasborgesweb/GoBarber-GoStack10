// Importando o JWT
import jwt from 'jsonwebtoken';

// Importando Arquivo de Autenticação
import authConfig from '../../config/auth';

// Importando a Model de Usuário
import User from '../models/User';

class SessionController {
    async store(req, res) {
        const { email, password } = req.body;

        // Buscando um Usuário com o Email informado
        const user = await User.findOne({ where: { email } });

        // Verificando se Existe um usuário com aquele Email
        if (!user) {
            return res.status(400).json({ error: 'User not found.' });
        }

        // Verificando se a Senha está Correta
        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ error: 'Password does not match' });
        }
        // Verificando se a Senha está Correta
        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ error: 'Password does not match' });
        }

        const { id, name } = user;

        // Criando a Autenticação JWT
        return res.json({
            user: { id, name, email },
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }
}

export default new SessionController();
