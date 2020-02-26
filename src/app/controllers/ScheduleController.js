// Importando Operador do Sequelize
import { Op } from 'sequelize';

// Importando as Validações de Horas
import { startOfDay, endOfDay, parseISO } from 'date-fns';

// Importando a Model de Agendamento
import Appointment from '../models/Appointment';

// Importando a Model de Usuario
import User from '../models/User';

class ScheduleController {
    async index(req, res) {
        // Checando se usuário é um prestador de Serviço
        const checkUserProvider = await User.findOne({
            where: { id: req.userId, provider: true },
        });

        if (!checkUserProvider) {
            return res.status(401).json({ error: 'User is not provider!' });
        }

        // Verificando os Agendamentos do Dia
        const { date } = req.query;
        const parseDate = parseISO(date);

        const appointments = await Appointment.findAll({
            where: {
                provider_id: req.userId,
                canceled_at: null,
                date: {
                    [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)],
                },
            },
            order: ['date'],
        });
        return res.json(appointments);
    }
}

export default new ScheduleController();
