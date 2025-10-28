import mongoose from 'mongoose'; // ✅ Cambiado a ES6 import

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});
export default mongoose.model('Student', studentSchema);