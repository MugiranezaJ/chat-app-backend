import Joi from 'joi'
export const registerUserValidation= (req, res, next) =>{
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        username: Joi.string().required(),
        // role: Joi.string().required(),
        password: Joi.string().required()
    })
  const { error } = schema.validate(req.body);
  if(error) next(error.details[0])
  next();
}

export const userLoginValidation= (req, res, next) =>{
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
  const { error } = schema.validate(req.body);
  if(error) return res.status(400).json({status: 400, error: error.details[0].message})
  next();
}