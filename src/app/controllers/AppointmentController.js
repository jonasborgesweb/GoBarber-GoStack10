// Importando o Schema Validation
import * as Yup from 'yup';

// Importando a Model de Usuário
import User from '../models/User';

// Importando a Model de Agendamento
import Appointment from '../models/Appointment';

class AppointmentController {
    async store(req, res) {
        // Validação dos Dados
        const schema = Yup.object().shape({
            provider_id: Yup.number().required(),
            date: Yup.date().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation Fails!' });
        }

        const { provider_id, date } = req.body;

        // Checando se Provider_id é um Provider
        const isProvider = await User.findOne({
            where: { id: provider_id, provider: true },
        });

        if (!isProvider) {
            return res.status(401).json({
                error: 'You can only create appointments with providers ',
            });
        }

        // Criando o Agendamento
        const appointment = await Appointment.create({
            user_id: req.userId,
            provider_id,
            date,
        });
        return res.json(appointment);
    }
}

export default new AppointmentController();
