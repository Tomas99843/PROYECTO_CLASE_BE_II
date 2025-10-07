function logger(req, res, next) {
    const start = Date.now();
    console.log(`[start] ${req.method} ${req.originalUrl}`);

    res.on('finish', () => {
        const ms = Date.now() - start;
        console.log(`[end] ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | Tiempo: ${ms}ms`);
    });
    next();
};

export default logger;