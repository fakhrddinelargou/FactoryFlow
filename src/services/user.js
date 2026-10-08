const { create, findUserByEmail } = require('../repositories/user');
const { hash } = require('bcrypt');
const AppError = require('../utils/AppError')



async function createOperator({ first_name, last_name, email, password }) {

        const existUser = await findUserByEmail(email);

        if (existUser) {
            throw new AppError('Email already existed', 409)
        }

        const hashedPassword = await hash(password, 10);

        const user = await create({ first_name, last_name, email, password: hashedPassword })
        if (!user) {
            throw new AppError('Something wrong with creation', 400)
        }

        return {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
        };
    
}



module.exports = { createOperator }