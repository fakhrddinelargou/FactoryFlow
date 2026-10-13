const { findByRef, createProduct, findProductById , findProductByRefExcept, updateProduct } = require('../repositories/product');
const withTransaction = require('../repositories/transaction');
const AppError = require('../utils/AppError');
const { findMaterialsByIds } = require('../repositories/Material');

async function ensureMaterialsExist(composition) {
  const ids = composition.map((item) => item.material);

  const found = await findMaterialsByIds(ids);
  const foundIds = new Set(found.map((m) => m.id));

  const missing = ids.filter((id) => !foundIds.has(id));
  if (missing.length > 0) {
    throw new AppError(`Matière(s) inexistante(s): ${missing.join(', ')}`, 400);
  }
}

async function handleCreateProduct(data) {
  const existReference = await findByRef(data.reference);
  if (existReference) {
    throw new AppError('Référence déjà utilisée', 409);
  }

  await ensureMaterialsExist(data.composition);

  return createProduct(data);
}

async function handleUpdateProduct(id, data) {
  const product = await findProductById(id);
  if (!product) throw new AppError('Produit introuvable', 404);

  if (data.reference) {
    const taken = await findProductByRefExcept(data.reference, id);
    if (taken) throw new AppError('Référence déjà utilisée', 409);
  }

  if (data.composition) {
    await ensureMaterialsExist(data.composition);   
  }

  return updateProduct(id, data);
}

module.exports = { handleCreateProduct, handleUpdateProduct }