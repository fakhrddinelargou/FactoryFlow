const {handleCreateOrder , handleUpdateOrder , handleGetOrders} =  require('../services/productionOrder');



const create =  async (req,res) => {
    const order = await handleCreateOrder(req.body , req.user.id);
    return  res.status(201).json({success : true  , data : order})
}

const update =  async (req,res) => {
    const order = await handleUpdateOrder(req.body , req.params.id);
    return  res.status(200).json({success : true  , data : order})
}

const get =  async (req,res) => {
    const orders = await handleGetOrders(req.query);
    return  res.status(200).json({success : true  , data : orders , count : orders.length})
}


module.exports = {create ,  update , get}