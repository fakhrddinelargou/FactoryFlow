const {handleCreateOrder} =  require('../services/productionOrder');



const create =  async (req,res) => {
    const order = await handleCreateOrder(req.body , req.user.id);
    return  res.status(201).json({success : true  , data : order})
}



module.exports = {create}