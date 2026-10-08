const User = require('../models/User');

async function create(data, session) {
  const [user] = await User.create([data], { session });
  return user;
}


module.exports = {create}