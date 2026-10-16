const { handleCreateProduct , handleUpdateProduct , handGetProductById , handGetProduct} = require('../services/product')

const create = async (req, res) => {
  const product = await handleCreateProduct(req.body);
  res.status(201).json({ success: true, data: product });
}

const update = async (req, res) => {
  const product = await handleUpdateProduct(req.params.id, req.body);
  res.status(200).json({ success: true, data: product });
}

const getProduct = async (req,res) => {
  const products = await handGetProduct();
  res.status(200).json({success : true  ,  data : products});
}

const getProductById = async (req,res) => {
  const product = await handGetProductById(req.params.id);
  res.status(200).json({success : true  ,  data : product});
}

module.exports = { create, update , getProduct ,getProductById}