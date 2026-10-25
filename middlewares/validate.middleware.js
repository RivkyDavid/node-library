

export const validate = (schema) =>{
    return (req,res,next)=>{
        const {error}=schema.validate(req.body,{abortEarly:false});

        if(error){
            res.status(400);

            const errorsArray = error.details.map(detail => detail.message);

            const validationError = new Error('Validation failed');
            validationError.errors = errorsArray;

            return next(validationError)
        }

        next();
    };
};