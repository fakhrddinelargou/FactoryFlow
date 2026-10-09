const AppError = require('../utils/AppError')
const {handleCreation  ,handleUpdate , handleUpdateQuantity} = require('../services/Material');


const create = async (req, res) => {
  const material = await handleCreation(req.body, req.user.id);
  res.status(201).json({ success: true, data: material });
};

const update = async (req, res) => {
  const material = await handleUpdate(req.params.id, req.body);
  res.status(200).json({ success: true, data: material });
};

const updateQuantity = async (req,res) => {
    const material = await handleUpdateQuantity(req.user.id,req.params.id,req.body.quantity);
  res.status(200).json({ success: true, data: material }); 
}

 
module.exports = {create , update , updateQuantity}