import mongoose from 'mongoose';
import environment from '../env.config.js';

export const connectAuto = async () => {
    try {
        const mongoUrl = environment.MONGO_TARGET === 'atlas' 
            ? environment.MONGO_URI_ATLAS 
            : environment.MONGO_URI;
            
        await mongoose.connect(mongoUrl);
        console.log('MongoDB conectado correctamente');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error.message);
        process.exit(1);
    }
};