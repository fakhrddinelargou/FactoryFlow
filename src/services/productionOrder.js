const { createOrder } = require('../repositories/productionOrder');
const {findProductById} = require('../repositories/product');
const {findUserById} = require('../repositories/user');

const withTransaction = require('../repositories/transaction');
const AppError = require('../utils/AppError');


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



module.exports = {handleCreateOrder}