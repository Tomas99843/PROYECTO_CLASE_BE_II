// Export autorización por roles 
export const requireRole = (...roles) => (req, res, next) => {
    // passport coloca el usuario en req.user
    if (!req.user) return res.status(401).json({ error: "No autorizado" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: "No tienes permiso para acceder a este recurso" });
    next();
};