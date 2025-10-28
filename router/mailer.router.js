// ✅ CORREGIDO:
import {Router} from "express";
import { mailerController as ctrl } from '../app/controllers/mailer.controller.js';

const router = Router();

router.post('/api/mail/welcome', (req,res) => ctrl.sendWelcomeEmail(req,res)); // ✅ Nombre corregido
router.post('/api/mail/order-status', (req,res) => ctrl.sendOrderStatusEmail(req,res)); // ✅ Nombre corregido

export default router;