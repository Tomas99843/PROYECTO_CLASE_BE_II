import { Router } from 'express';
import { requireJwtCookie } from '../middleware/user.middleware.js';
import { requireRole } from '../middleware/policies.middleware.js'; // ✅ Corregido nombre
import { studentController as ctrl } from '../app/controllers/student.controller.js';

const router = Router();

router.use(requireJwtCookie);

router.get('/', ctrl.list);
router.get('/:id', requireRole('admin', 'user'), ctrl.get); // ✅ Corregido policies a requireRole
router.post('/', requireRole('admin'), ctrl.create); // ✅ Corregido policies a requireRole
router.put('/:id', requireRole('admin'), ctrl.update); // ✅ Corregido policies a requireRole
router.delete('/:id', requireRole('admin'), ctrl.remove); // ✅ Corregido policies a requireRole

export default router;