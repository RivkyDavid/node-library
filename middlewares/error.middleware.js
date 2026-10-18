export const notFoundHundler = (req, res, next) => {
    const error = new Error(`route not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

export const globalErrorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    const isDevMode = process.env.NODE_ENV === 'developement';

    res.status(statusCode).json({
        error: {
            massage: err.massage || 'Internal Server Error',
            type: 'server error',
            stack: isDevMode ? err.stack : undefined
        }
    });
};