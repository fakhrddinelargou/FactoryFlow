const {stockMovment, countMovment} = require('../repositories/stockMovement');


async function listMovements({material , type , page = 1,  limit = 10}) {
    const filter = {};

    if(material) filter.material = material;
    if(type) filter.type = type;

    const skip  = (page - 1) * limit;

    const [movements , total] = await Promise.all([stockMovment(filter , skip , limit) , countMovment(filter)]);

      return {
    data: movements,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

}


module.exports = {listMovements}