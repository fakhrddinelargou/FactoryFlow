const {handleCreateOrder , handleUpdateOrder ,handleStartOrder, handleGetOrders, handleGetOrdersByOperaterId , handleGetOrderById} =  require('../services/productionOrder');



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

const getOperaterOrders = async (req,res) => {
    const orders = await handleGetOrdersByOperaterId(req.user.id , req.query);
    return res.status(200).json({success : true , data : orders})
}

const getByOrderId = async (req,res) => {
    const orders = await handleGetOrderById(req.params.id , req.user.id);
    return res.status(200).json({success : true , data : orders})
}


const startOrder = async (req,res) => {    
    const result = await handleStartOrder(req.params.id , req.user.id);
    return res.status(200).json({success : true, data : result})
}


module.exports = {create ,  update , get , getOperaterOrders ,getByOrderId, startOrder}