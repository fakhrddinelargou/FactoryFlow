const User = require('../models/User');

async function create(data, session) {
  const [user] = await User.create([data], { session });
  return user;
}

async function findUserByEmail(email) {
  return await User.findOne({email});
}

async function findUserById (id){
return await User.findById(id)
}
module.exports = {create  ,  findUserByEmail , findUserById}