import Student from '../config/models/student.model.js';

export default class StudentService { // ✅ Corregido nombre de clase y export
    async list() { 
        return Student.find(); 
    }
    
    async getById(id) { 
        return Student.findById(id); 
    }
    
    async create(dto) { 
        return Student.create(dto); 
    }
    
    async update(id, dto) { 
        return Student.findByIdAndUpdate(id, dto, { new: true }); 
    }
    
    async delete(id) { // ✅ Corregido nombre para coincidir con controller
        return !!(await Student.findByIdAndDelete(id)); 
    }
}