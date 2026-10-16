const StockMovement = require('../models/StockMovement');

async function createMovement(data , session) {
     await StockMovement.create([data] , {session})
}

async function stockMovment(filter , skip , limit) {
     return await StockMovement.find(filter)
     .populate('material' , 'reference name unit')
     .populate('createdBy' , 'first_name last_name')
     .sort({createdAt : -1})
     .skip(skip)
     .limit(limit)
} 

async function countMovment(filter) {
     return await StockMovement.countDocuments(filter);
}

module.exports = {createMovement , stockMovment , countMovment , stockMovment}