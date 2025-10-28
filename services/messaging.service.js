import twilio from 'twilio';

const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_FROM_SMS,
    TWILIO_FROM_WAPP
} = process.env;

export class MessagingService {
    constructor() {
        if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
            console.warn('[MessagingService] Twilio credentials not configured - messaging disabled');
            this.client = null; // Deshabilitar cliente en lugar de lanzar error
            return;
        }
        this.client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    }

    async sendSMS({ to, body }) {
        // Verificar si Twilio está configurado
        if (!this.client) {
            console.warn('[MessagingService] SMS not sent - Twilio not configured');
            return { 
                sid: null, 
                status: 'disabled',
                to: to,
                message: 'Twilio not configured'
            };
        }
        
        try {
            const message = await this.client.messages.create({
                body,
                from: TWILIO_FROM_SMS,
                to
            });
            return { 
                sid: message.sid, 
                status: message.status,
                to: message.to 
            };
        } catch (error) {
            throw new Error(`SMS sending failed: ${error.message}`);
        }
    }

    async sendWhatsApp({ to, body }) {
        // Verificar si Twilio está configurado
        if (!this.client) {
            console.warn('[MessagingService] WhatsApp not sent - Twilio not configured');
            return { 
                sid: null, 
                status: 'disabled',
                to: to,
                message: 'Twilio not configured'
            };
        }
        
        try {
            const message = await this.client.messages.create({
                body,
                from: `whatsapp:${TWILIO_FROM_WAPP}`,
                to: `whatsapp:${to}`
            });
            return { 
                sid: message.sid, 
                status: message.status,
                to: message.to 
            };
        } catch (error) {
            throw new Error(`WhatsApp sending failed: ${error.message}`);
        }
    }
}

export const messagingService = new MessagingService();