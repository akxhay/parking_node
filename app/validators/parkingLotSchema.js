const Joi = require('joi');

const parkingLotSchema = Joi.object({
  name: Joi.string().required(),
  floors: Joi.array()
    .min(1)
    .items(
      Joi.object({
        name: Joi.string().required(),
        smallSlots: Joi.number().integer().min(0),
        mediumSlots: Joi.number().integer().min(0),
        largeSlots: Joi.number().integer().min(0),
        xlargeSlots: Joi.number().integer().min(0),
      })
    )
    .required(),
});

module.exports = parkingLotSchema;
