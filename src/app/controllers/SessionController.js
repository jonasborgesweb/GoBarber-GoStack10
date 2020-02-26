// Importando Schema Validation
import * as Yup from 'yup';

// Importando o JWT
import jwt from 'jsonwebtoken';

// Importando Arquivo de Autenticação
import authConfig from '../../config/auth';

// Importando a Model de Usuário
import User from '../models/User';

class SessionController {
    async store(req, res) {
        // Validando os Campos recebidos
        const schema = Yup.object().shape({
            email: Yup.string().required(),
            password: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation Fails!' });
        }

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
