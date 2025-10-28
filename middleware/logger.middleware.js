function logger(req, _res, next) { // ✅ Agregado _res para parámetro no usado
    const start = Date.now();
    console.log(`[start] ${req.method} ${req.originalUrl}`);

    _res.on('finish', () => {
        const ms = Date.now() - start;
        console.log(`[end] ${req.method} ${req.originalUrl} | Status: ${_res.statusCode} | Tiempo: ${ms}ms`);
    });
    next();
}

export default logger; // ✅ Cambiado a ES6 export