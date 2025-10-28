import { Router } from 'express';
import User from '../config/models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { requireJwtCookie } from "../middleware/user.middleware.js";
import env from '../config/env.config.js'; // ✅ Import agregado para JWT_SECRET

const router = Router();

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    // Validar datos
    if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).json({ error: "Todos los datos son requeridos" });
    }

    // Verificar si el usuario ya existe
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email ya registrado" });

    // Crear nuevo usuario (el hash se hace automáticamente)
    await User.create({ first_name, last_name, email, age, password });

    res.status(201).json({ message: "Usuario creado" });
});

// JWT Routes
router.post('/jwt/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Faltan credenciales" }); // ✅ Tilde corregida    
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Credenciales inválidas" }); // ✅ Tilde corregida
    
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Contraseña inválida" }); // ✅ Tilde corregida

    const payload = {
        sub: String(user._id), 
        email: user.email, 
        first_name: user.first_name,
        role: user.role
    };
    
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "1h" }); // ✅ Corregido environment a env

    // httpOnly cookie
    res.cookie('access_token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 60 * 60 * 1000, // 1 hora
        path: '/'
    });

    res.json({ 
        message: "Login OK (JWT en cookie)",
        user: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
        }
    });
});

router.get('/jwt/me', requireJwtCookie, async (req, res) => {
    // req.user ya viene del middleware con todos los datos
    const { first_name, last_name, email, age, role } = req.user;
    res.json({ user: { first_name, last_name, email, age, role } });
});

router.post('/jwt/logout', (_req, res) => {
    res.clearCookie('access_token', { path: '/' });
    res.json({ message: "Logout OK - Cookie de JWT borrada" });
});

export default router;