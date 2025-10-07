import express from 'express';

import authRouter from '../routes/auth.router.js';
import homeRouter from '../routes/home.router.js';
import studentRouter from '../routes/student.router.js';

import { connectAuto } from '../config/db/connect.config.js';
import logger from '../middleware/logger.middleware.js';

import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import passport from 'passport';
import { initPassport } from '../config/auth/passport.config.js';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(logger);

// Configuración de sesiones
export const startServer = async () => {
    await connectAuto();
    
    const store = MongoStore.create({
        client: (await import ('mongoose')).default.connection.getClient(),
        ttl: 60 * 60, // 1 hora
    });

    app.use(
        session({
            secret: process.env.SESSION_SECRET || 'clave_secreta',
            resave: false,
            saveUninitialized: false,
            store: store,
            cookie: {
                maxAge: 60 * 60 * 1000, // 1 hora
                httpOnly: true,
            },
        })
    );

    // Inicialización de Passport
    initPassport();
    app.use(passport.initialize());
    app.use(passport.session());

    // Rutas
    app.use('/', homeRouter);
    app.use('/student', studentRouter);
    app.use('/auth', authRouter);

    // Manejo de errores 404
    app.use((_, res) => {
        res.status(404).json({ error: "Ruta no encontrada" });
    });

    app.listen(PORT, () => console.log(`Servidor corriendo correctamente en http://localhost:${PORT}`));
};