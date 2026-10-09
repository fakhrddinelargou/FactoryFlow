const Material = require('../models/Material');

async function createMaterial(data ,session) {
    return await Material.create([data] , {session})
}

async function findMaterialByRef(reference) {
    return await Material.findOne({reference});
}

async function findMaterialById(id) {
    return await Material.findById(id);
}

async function updateMaterial(id, data, session) {
  return Material.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
    session,
  });
}


async function updateQuantity(id , quantity , session) {
    return await Material.findByIdAndUpdate(id,{$inc : {availableQuantity : quantity }},{returnDocument : 'after' ,runValidators : true , session })
}

module.exports = {createMaterial ,findMaterialByRef , findMaterialById , updateMaterial  ,updateQuantity }