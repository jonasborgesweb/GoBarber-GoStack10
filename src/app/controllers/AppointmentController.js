// Importando o Schema Validation
import * as Yup from 'yup';

// Importando Validacão de Horas
import { startOfHour, parseISO, isBefore, format } from 'date-fns';

// Importando o Tipo Portugues para a Data
import pt from 'date-fns/locale/pt';

// Importando a Model de Usuário
import User from '../models/User';

// Importando a Model de File
import File from '../models/File';

// Importando a Model de Agendamento
import Appointment from '../models/Appointment';

// Importando o Schema de Notificação
import Notification from '../schemas/Notification';

class AppointmentController {
    async index(req, res) {
        const { page } = req.query;

        const appointments = await Appointment.findAll({
            where: { user_id: req.userId, canceled_at: null },
            order: ['date'],
            limit: 20,
            offset: (page - 1) * 20,
            attributes: ['id', 'date'],
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: File,
                            as: 'avatar',
                            attributes: ['id', 'path', 'url'],
                        },
                    ],
                },
            ],
        });

        return res.json(appointments);
    }

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

        // Check for Past Date
        const hourStart = startOfHour(parseISO(date));

        if (isBefore(hourStart, new Date())) {
            return res
                .status(400)
                .json({ error: 'Past dates are not permitted' });
        }

        // Check date availability
        const checkAvailability = await Appointment.findOne({
            where: {
                provider_id,
                canceled_at: null,
                date: hourStart,
            },
        });

        if (checkAvailability) {
            return res
                .status(400)
                .json({ error: 'Appointment date is not available' });
        }

        // Criando o Agendamento
        const appointment = await Appointment.create({
            user_id: req.userId,
            provider_id,
            date: hourStart,
        });

        // Criando a Notificação do Agendamento
        const user = await User.findByPk(req.userId);
        const formattedDate = format(
            hourStart,
            "'dia' dd 'de' MMMM ' , ás' H:mm 'h'",
            { locale: pt }
        );

        await Notification.create({
            content: `Novo Agendamento de ${user.name} para ${formattedDate}`,
            user: provider_id,
        });
        return res.json(appointment);
    }
}

export default new AppointmentController();