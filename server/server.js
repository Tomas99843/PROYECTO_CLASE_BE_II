import express from 'express';
import authRouter from '../router/auth.router.js';
import homeRouter from '../router/home.router.js';
import studentRouter from '../router/student.router.js';
import new_studentRouter from '../router/new_student.router.js';
import apiV1Router from "../router/api.v1.router.js";
import advancedRouter from "../router/advancedRouter.js";
import processRouter from '../router/process.router.js';
import orderRouter from '../router/order.router.js';
import messagingRouter from '../router/messaging.router.js'
import environment, { validateEnv } from '../config/env.config.js';
import { connectAuto } from '../config/db/connect.config.js';
import logger from '../middleware/logger.middleware.js';
import mailerRouter from '../router/mailer.router.js';

import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';

import passport from 'passport';
import { initPassport } from '../config/db/auth/passport.config.js';

import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { hbsHelpers } from './hbs.helper.js';

const app = express();
const PORT = environment.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(logger);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const startServer = async () => {
    validateEnv();
    await connectAuto();
    
    const store = MongoStore.create({
        mongoUrl: process.env.ATLAS_URL,
        ttl: 60 * 60,
    });

    app.use(
        session({
            secret: environment.MONGO_SESSION_SECRET || 'clave_secreta',
            resave: false,
            saveUninitialized: false,
            store: store,
            cookie: {
                maxAge: 60 * 60 * 1000,
                httpOnly: true,
            },
        })
    );

    initPassport();
    app.use(passport.initialize());
    app.use(passport.session());

    app.engine('handlebars', engine({
        defaultLayout: 'main',
        layoutsDir: path.join(__dirname, '../app/views/layouts'),
        helpers: hbsHelpers,
    }));
    app.set('view engine', 'handlebars');
    app.set('views', path.join(__dirname, '../app/views'));

    app.use('/', homeRouter);
    app.use('/student', studentRouter);
    app.use('/new-student', new_studentRouter);
    app.use('/auth', authRouter);
    app.use('/', orderRouter);
    app.use('/api/v1', apiV1Router);
    app.use('/advanced', advancedRouter);
    app.use('/process', processRouter);
    app.use('/', messagingRouter);
    app.use('/', mailerRouter);
    app.use((_, res) => {
        res.status(404).json({ error: "Ruta no encontrada" });
    });

    process.on('unhandledRejection', (reason) => {
        console.error('[process] Unhandled Rejection', reason);
    });
    
    process.on('uncaughtException', (err) => {
        console.error('[process] Uncaught Exception', err);
    });
    
    process.on('SIGINT', () => {
        console.log('\n[process] SIGINT recibido. Cerrando...');
        process.exit(0);
    });

    app.listen(PORT, () => console.log(`Servidor corriendo correctamente en http://localhost:${PORT}`));
};