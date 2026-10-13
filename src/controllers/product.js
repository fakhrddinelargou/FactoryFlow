const { handleCreateProduct , handleUpdateProduct} = require('../services/product')

const create = async (req, res) => {
  const product = await handleCreateProduct(req.body);
  res.status(201).json({ success: true, data: product });
}

const update = async (req, res) => {
  const product = await handleUpdateProduct(req.params.id, req.body);
  res.status(200).json({ success: true, data: product });
}


module.exports = { create, update }