const {createOperator} = require('../services/user')
const AppError = require('../utils/AppError')

async function create(req,res) {
    const user =  await createOperator(req.body);
    if(!user)throw new AppError('Something wrong' , 400)
    res.status(201).json({success : true , data : user})
}

async function me(req, res) {
  res.status(200).json({ success: true, data: req.user });
}


module.exports = {create, me}