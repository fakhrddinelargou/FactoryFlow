const { createMaterial, findMaterialByRef, findMaterialById ,updateMaterial, updateQuantity } = require('../repositories/Material');
const {createMovement} = require('../repositories/stockMovement')
const withTransaction = require('../repositories/transaction');
const AppError = require('../utils/AppError')


async function handleCreation(id,data) {

    const material = await findMaterialByRef(data.reference.toUpperCase());

    if (material) {
        throw new AppError('reference already existed', 409);
    }

    return withTransaction(async (session) => {
        const material = await createMaterial(data, session)

        if (material[0].availableQuantity > 0) {
            await createMovement({
                material: material[0]._id,
                type: 'IN',
                quantity: material[0].availableQuantity,
                reason: 'stock initial',
                createdBy: id,
            }, session);            
        }

        return material[0];
    })
}

async function handleUpdate(id,data) {

    
    const material = await findMaterialById(id);
    const fields = {}
   
    if(!material){
       throw new AppError('Material not found' , 404);
    }

    if(material?.reference === data?.reference){
       throw new AppError('Reference already existed' , 409);
    }


    
    if(data.name !== undefined && data.name !== material.name){fields.name = data.name}
    if(data.unit !== undefined && data.unit !== material.unit){fields.unit = data.unit}
    if(data.alertThreshold !== undefined && data.alertThreshold !== material.alertThreshold){fields.alertThreshold = data.alertThreshold}
    if(data.reference !== undefined && data.reference !== material.reference){fields.reference = data.reference}
    
    if(Object.keys(fields).length === 0){
       throw new AppError('nothing changed' , 400)
    }

    return withTransaction(async (session)=>{
     return  await updateMaterial(id , fields , session)
    })







}


async function handleUpdateQuantity (userId,id,quantity) {
    
    const material = await findMaterialById(id);
       
       
    if(!material){
       throw new AppError('Material not found' , 404);
    }

    return withTransaction(async (session) =>{
        
      const rt = await updateQuantity(id,quantity,session);

            await createMovement({
                material: material._id,
                type: 'IN',
                quantity: quantity,
                reason: 'entrée de stock',
                createdBy: userId,
            }, session);            
        

        return rt;
    
    })
}

module.exports = { handleCreation  , handleUpdate ,handleUpdateQuantity}