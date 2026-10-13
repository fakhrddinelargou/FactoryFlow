const ProductionOrder = require('../models/ProductionOrder');

async function createOrder(data , session) {
    return await ProductionOrder.create([data] , {session});
}



module.exports = {createOrder}