const AppError = require('../utils/AppError')
const { handleCreation, handleUpdate, handleUpdateQuantity, handleGetMaterials, handleGetMaterial, handleFindMaterialsBelowThreshold } = require('../services/Material');


const create = async (req, res) => {  
  const material = await handleCreation(req.user.id ,req.body);
  res.status(201).json({ success: true, data: material });
};

const update = async (req, res) => {
  const material = await handleUpdate(req.params.id, req.body);
  res.status(200).json({ success: true, data: material });
};

const updateQuantity = async (req, res) => {
  const material = await handleUpdateQuantity(req.user.id, req.params.id, req.body.quantity);
  res.status(200).json({ success: true, data: material });
}

const getAllMaterials = async (req, res) => {
  const materials = await handleGetMaterials();
  res.status(200).json({ success: true, data: materials });
}

const getOneMaterial = async (req, res) => {
  const materials = await handleGetMaterial(req.params.id);
  res.status(200).json({ success: true, data: materials });
}

const findMaterialsBelowThreshold = async (req, res) => {
  const materials = await handleFindMaterialsBelowThreshold();
  res.status(200).json({ success: true, data: materials });
}

module.exports = { create, update, updateQuantity, getAllMaterials, getOneMaterial ,findMaterialsBelowThreshold }