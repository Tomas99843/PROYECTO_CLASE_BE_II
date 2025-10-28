import CustomRouter from "./_customRouter.js";
import { requireJwtCookie } from "../middleware/user.middleware.js";
import { requireRole } from "../middleware/policies.middleware.js"; // ✅ Corregido nombre
import Student from "../config/models/student.model.js"; // ✅ Corregida ruta y import

const router = new CustomRouter({ mergeParams: true });

// Params loader (carga previa de :id)
router.params('id', async (req, _res, next) => { // ✅ Corregido _next a next
    try {
        const s = await Student.findById(req.params.id).lean();
        req.studentLoader = s || null;
    } catch (_) {
        req.studentLoader = null;
    }
    next(); // ✅ Corregido _next a next
});

// Ruta con middleware en cadena (orden claro): auth -> política de roles -> handler
router.get('/student/:id', requireJwtCookie, requireRole('admin', 'user'), (req, res) => { // ✅ Corregido policies a requireRole
    if (!req.studentLoader)
        return res.status(404).json({ error: 'Estudiante no encontrado' }); // ✅ Cambiado send a json
    res.status(200).json({ loadedByParams: true, student: req.studentLoader });
});

// Enrutador ping 
router.group('/v1', (v1) => { // ✅ Agregado slash
    v1.get('/ping', (_req, res) => res.json({ pong: true, version: 'v1' })); // ✅ Cambiado send a json
});

// SubRouter anidado con MergeParams: /students/:id/courses/*
router.group('/students/:id', (sub) => {
    sub.get('/courses', requireJwtCookie, (req, res) => {
        res.json({ 
            studentId: req.params.id, 
            note: "Ejemplo de subrouter con MergeParams", 
            courses: ["JS AVANZADO", "DB BÁSICO"] // ✅ Tilde corregida
        });
    });
});

// Router async con error capturado automáticamente por CustomRouter
router.get('/boom', async (_req, _res) => {
    throw new Error("Error capturado por CustomRouter");
});

export default router.router;