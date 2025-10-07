import mongoose from 'mongoose';

export const connectAuto = async () => {
    try {
        await mongoose.connect(process.env.ATLAS_URL);
        console.log('MongoDB Atlas conectado correctamente');
    } catch (error) {
        console.error('Error conectando a MongoDB Atlas:', error.message);
        process.exit(1);
    }
};