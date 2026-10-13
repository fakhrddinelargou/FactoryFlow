const Product = require('../models/Product');


async function  createProduct(data , session) {
    return await Product.create([data] , {session});
}


async function updateProduct(id, data) {
  return Product.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });
}


async function findByRef(ref) {
    return await Product.findOne({reference : ref});
}



async function findProductById(id) {
    return await Product.findById(id);
}

async function findProductByRefExcept(reference, id) {
  return Product.findOne({ reference, _id: { $ne: id } });
}

module.exports = {createProduct ,findByRef,findProductByRefExcept,updateProduct,findProductById }