import { Router } from 'express';
import Student from '../config/models/student.model.js';
import { requireJwtCookie } from '../middleware/user.middleware.js';
import { requireRole } from '../middleware/policies.middleware.js';
const router = Router();

// GET - Todos los estudiantes
router.get('/', requireJwtCookie, async (_req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Estudiante por ID
router.get('/:id', requireJwtCookie, requireRole('admin', 'user'), async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ error: "Estudiante no encontrado" });
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Crear estudiante
router.post('/', requireJwtCookie, requireRole('admin'), async (req, res) => {
    try {
        const { name, age, email } = req.body;
        
        if (!name || !age || !email) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        const student = new Student({ name, age: parseInt(age), email });
        await student.save();
        
        res.status(201).json({
            message: "Estudiante creado exitosamente",
            student
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT - Actualizar estudiante
router.put('/:id', requireJwtCookie, requireRole('admin'), async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        if (!student) return res.status(404).json({ error: "Estudiante no encontrado" });
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Eliminar estudiante
router.delete('/:id', requireJwtCookie, requireRole('admin'), async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ error: "Estudiante no encontrado" });
        res.status(200).json({ message: "Estudiante eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;