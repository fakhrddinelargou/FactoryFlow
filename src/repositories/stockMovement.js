const StockMovement = require('../models/StockMovement');

async function createMovement(data , session) {
     await StockMovement.create([data] , {session})
}

module.exports = {createMovement}