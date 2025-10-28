import dotenv from 'dotenv';

dotenv.config();

const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '5000', 10),
    MONGO_TARGET: (process.env.MONGO_TARGET || 'local').toLowerCase(),
    MONGO_URI: process.env.MONGO_URI || '',
    MONGO_URI_ATLAS: process.env.ATLAS_URL || '',
    MONGO_SESSION_SECRET: process.env.MONGO_SESSION_SECRET || '',
    JWT_SECRET: process.env.JWT_SECRET || '',
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '',
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL || ''
};

export function validateEnv() {
    const missing = [];
    if (!env.MONGO_SESSION_SECRET) missing.push('MONGO_SESSION_SECRET');
    if (!env.JWT_SECRET) missing.push('JWT_SECRET');
    if (env.MONGO_TARGET === 'local' && !env.MONGO_URI) missing.push('MONGO_URI');
    if (env.MONGO_TARGET === 'atlas' && !env.MONGO_URI_ATLAS) missing.push('MONGO_URI_ATLAS');
    if (missing.length) {
        console.error('Faltan variables de entorno:', missing.join(', '));
        process.exit(1);
    }
}

export function getPublicEnv() {
    return {
        NODE_ENV: env.NODE_ENV,
        PORT: env.PORT,
        MONGO_TARGET: env.MONGO_TARGET,
        JWT_SECRET: env.JWT_SECRET
    };
}

export default env;