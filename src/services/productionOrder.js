const { createOrder , updateOrder , findOrderById ,getAllOrders, getOrderByOpirater } = require('../repositories/productionOrder');
const {findProductById} = require('../repositories/product');
const {findUserById} = require('../repositories/user');
const AppError = require('../utils/AppError');

const withTransaction = require('../repositories/transaction');


async function handleCreateOrder(data, userId) {
  const product = await findProductById(data.product);
  if (!product) throw new AppError('Produit introuvable', 404);

  const operator = await findUserById(data.assignedTo);
  if (!operator || operator.role !== 'operateur') {
    throw new AppError('assignedTo doit être un opérateur existant', 400);
  }

  return createOrder({
    product: product._id,
    quantity: data.quantity,
    assignedTo: operator._id,
    status: 'PLANNED',
    composition: product.composition.map((item) => ({
      material: item.material,
      quantity: item.quantity,
    })),
    createdBy: userId,
  });
}


async function handleUpdateOrder(data,id) {
  const order = await findOrderById(id);
  if (!order) throw new AppError('Ordre introuvable', 404);

  if (order.status !== 'PLANNED') {
    throw new AppError('Seul un ordre PLANNED peut être modifié', 409);
  }

  if (data.assignedTo) {
    const operator = await findUserById(data.assignedTo);
    if (!operator || operator.role !== 'operateur') {
      throw new AppError('assignedTo doit être un opérateur existant', 400);
    }
  }

  return updateOrder(data,id);
}


async function handleGetOrders(query) {
  const filter = {};

if (query.status)  filter.status = query.status;
if (query.product) filter.product = query.product;

if (query.from || query.to) {
  filter.createdAt = {};
  if (query.from) filter.createdAt.$gte = query.from;
  if (query.to)   filter.createdAt.$lte = query.to;
}

  const skip = (query.page - 1) * query.limit ;  
  return await getAllOrders(skip,query.limit,filter);
}

async function handleGetOrdersByOperaterId(id,query) {
  const filter = {}
  const user = await findUserById(id);
  console.log(user);
  
  if(user.role === 'admin')throw new AppError('that user not operater' , 400);
  filter.assignedTo = id;
  if(query.status){
    filter.status = query.status;
  }
  console.log(filter);
  return await getOrderByOpirater(filter)
  
}


async function handleGetOrderById(id , userId) {
  
  const user = await findUserById(userId);
  if(user.role === 'admin'){
    return await findOrderById(id)
  }
  const filter = {}
  filter.assignedTo = userId;
  filter._id = id;

  console.log(filter);
  
  
  return await getOrderByOpirater(filter);
}

module.exports = {handleCreateOrder , handleUpdateOrder ,handleGetOrders ,handleGetOrdersByOperaterId , handleGetOrderById}