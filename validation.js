//VALIDATION
const Joi = require('@hapi/joi');

//Register Validation
const idValidation = data => {
    const schema = Joi.object({
        id: Joi.number()
            .min(1)
            .required()
    });
    return schema.validate(data);
};
const loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    });
    return schema.validate(data);
};

module.exports.idValidation = idValidation;

