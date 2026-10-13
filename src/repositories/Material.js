const Material = require('../models/Material');

async function createMaterial(data ,session) {
    return await Material.create([data] , {session})
}

async function findMaterialByRef(reference) {
    return await Material.findOne({reference : reference});
}

async function findMaterialById(id) {
    console.log(id);
    
    return await Material.findById(id);
}

async function getMaterial() {
    return await Material.find().sort({createdAt : -1});
}

async function updateMaterial(id, data, session) {
  return Material.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
    session,
  });
}

async function findMaterialsBelowThreshold() {
    return await Material.find({$expr : {$lt : ['$availableQuantity','$alertThreshold']}})
}

async function updateQuantity(id , quantity , session) {
    return await Material.findByIdAndUpdate(id,{$inc : {availableQuantity : quantity }},{returnDocument : 'after' ,runValidators : true , session })
}

async function findMaterialsByIds(ids) {
  return Material.find({ _id: { $in: ids } });
}

module.exports = {createMaterial ,findMaterialByRef , findMaterialById , updateMaterial , findMaterialsByIds ,updateQuantity , getMaterial , findMaterialsBelowThreshold}