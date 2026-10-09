const User = require('../models/User');

async function create(data, session) {
  const [user] = await User.create([data], { session });
  return user;
}

async function findByEmailWithPassword(email) {
  return  await User.findOne({email}).select('+password');
}

async function findUserById (id){
return await User.findById(id)
}
module.exports = {create  ,  findByEmailWithPassword , findUserById}