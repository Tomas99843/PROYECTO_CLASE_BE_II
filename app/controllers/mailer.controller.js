import { mailerServices as mailer } from '../../services/mailer.service.js';

export class MailerController {
    async sendWelcomeEmail(req, res) {
        try {
            const { to, name } = req.body;
            if (!to || !name) {
                return res.status(400).json({ error: 'Email and name are required' });
            }

            const result = await mailer.send({
                to,
                subject: 'Bienvenido a nuestra plataforma',
                template: 'welcome-status',
                context: { name }
            });

            res.status(200).json({
                message: 'Welcome email sent successfully',
                ...result
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async sendOrderStatusEmail(req, res) {
        try {
            const { to, orderCode, status, customerName } = req.body;
            if (!to || !orderCode || !status || !customerName) {
                return res.status(400).json({ 
                    error: 'Email, order code, status and customer name are required' 
                });
            }

            const result = await mailer.send({
                to,
                subject: `Actualización de tu orden ${orderCode}`,
                template: 'order-status',
                context: { orderCode, status, customerName }
            });

            res.status(200).json({
                message: 'Order status email sent successfully',
                ...result
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export const mailerController = new MailerController();