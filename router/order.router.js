import { Router } from "express";
import { requireJwtCookie } from "../middleware/user.middleware.js";
import { requireRole } from "../middleware/policies.middleware.js";
import { orderController as ctrl } from "../app/controllers/order.controller.js";

const router = Router();

router.use(requireJwtCookie);

// Vistas
router.get('/orders', (req, res) => ctrl.listView(req, res));

// APIREST 
router.get('/api/orders', (req, res) => ctrl.listJSON(req, res));
router.get('/api/orders/:id', requireRole('admin', 'user'), (req, res) => ctrl.getById(req, res));
router.get('/api/orders/code/:code', requireRole('admin','user'), (req, res) => ctrl.getByCode(req, res));
router.post('/api/orders/', requireRole('admin'), (req, res) => ctrl.create(req, res));
router.put('/api/orders/:id', requireRole('admin'), (req, res) => ctrl.update(req, res));
router.delete('/api/orders/:id', requireRole('admin'), (req, res) => ctrl.remove(req, res));
//semilla base
router.post('/api/orders/seed', requireRole('admin','user'), (req, res) => ctrl.seed(req, res));

export default router;