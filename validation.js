//VALIDATION
const Joi = require('@hapi/joi');
//Data Validation
const validate = data => {
    const idSchema = Joi.object({
        id: Joi.number()
            .min(1)
            .required(),
        toid: Joi.number()
        .min(1)
    });
    const nameEmailchema = Joi.object({
        email: Joi.string()
            .required()
            .email(),
        name: Joi.string()
            .min(4)
            .required()
    });
    const schema = Joi.object({
        id: Joi.number()
            .min(1)
            .required(),
        email: Joi.string()
            .required()
            .email(),
        name: Joi.string()
            .min(4)
            .required()
    });

    const checkKeys=Object.keys(data).length;
    switch(checkKeys){
        case 1:
            return idSchema.validate(data);
        break;
        case 2:
            if(data.toid!=undefined) return idSchema.validate(data);    
            else return nameEmailchema.validate(data);
        break;
        case 3:
            return schema.validate(data);
        break;
        default:

    }   
};

module.exports.validate = validate;


