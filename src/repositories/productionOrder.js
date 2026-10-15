const ProductionOrder = require('../models/ProductionOrder');

async function createOrder(data) {
    return await ProductionOrder.create(data);
}


async function updateOrder(data, id) {
    return await ProductionOrder.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
}

async function findOrderById(id) {
    return await ProductionOrder.findById(id)
        .populate('composition.material', 'reference name unit')
        .populate('createdBy', 'first_name last_name')
        .populate('assignedTo', 'first_name last_name')
        .populate('product', 'reference name')
}

async function getAllOrders(skip, limit, query) {
    return await ProductionOrder.find(query).sort({ createdAt: -1 })
        .populate('composition.material', 'reference name unit')
        .populate('createdBy', 'first_name last_name')
        .populate('assignedTo', 'first_name last_name')
        .populate('product', 'reference name')
        .skip(skip).limit(limit)

}

async function getOrderByOpirater(filter) {
    return await ProductionOrder.find(filter)
        .populate('composition.material', 'reference name unit')
        .populate('createdBy', 'first_name last_name')
        .populate('assignedTo', 'first_name last_name')
        .populate('product', 'reference name')
}
module.exports = { createOrder, updateOrder, getAllOrders, findOrderById, getOrderByOpirater }