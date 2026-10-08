const { findUserByEmail } = require('../repositories/user')
const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError');
const { compare } = require('bcrypt');

const loginUser = async ({email , password}) => {
    const user = await findUserByEmail(email);

    if (!user) {
        throw new AppError('Email or Password incorrect', 400)
    }

    const isMatch = checkPassword(password,user.password);

    if (!isMatch) {
        throw new AppError('Email ou mot de passe incorrect', 401);
    }

    const token = jwt.sign({id : user.id , first_name : user.first_name , last_name : user.last_name , role : user.role},process.env.JWT_SECRET ,{ expiresIn: process.env.JWT_EXPIRES_IN })

    return {
        token : token,
        user : {id : user.id , first_name : user.first_name , last_name : user.last_name , role : user.role}
    }
}



function checkPassword(password , hash){
  return compare(password , hash);
}

module.exports = {loginUser}