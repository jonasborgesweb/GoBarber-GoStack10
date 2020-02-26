import Notification from '../schemas/Notification';

// Importando a Model de Usuario
import User from '../models/User';

class NotificationController {
    async index(req, res) {
        // Check is Provider
        const checkIsProvider = await User.findOne({
            where: { id: req.userId, provider: true },
        });

        if (!checkIsProvider) {
            return res
                .status(400)
                .json({ error: 'Only provider can load notifications' });
        }

        // Create Notification
        const notifications = await Notification.find({
            user: req.userId,
        })
            .sort({ createdAt: 'desc' })
            .limit(20);

        return res.json(notifications);
    }
}

export default new NotificationController();
