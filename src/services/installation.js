const bcrypt = require('bcrypt');
const {markInstalled ,getOrCreate} = require('../repositories/installation');
const {create} = require('../repositories/user');
const withTransaction  = require('../repositories/transaction');
const AppError = require('../utils/AppError');

const getStatus = async () => {
  const installation = await getOrCreate();
  return { installed: installation.installed };
};

const install = async ({ first_name, last_name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return withTransaction(async (session) => {
    await getOrCreate(session);

    const installation = await markInstalled(session);
    if (!installation) {
      throw new AppError('Application déjà installée', 409);
    }

    const admin = await create(
      { first_name, last_name, email, password: hashedPassword, role: 'admin' },
      session
    );

    return {
      id: admin._id,
      first_name: admin.first_name,
      last_name: admin.last_name,
      email: admin.email,
      role: admin.role,
    };
  });
};

module.exports = { getStatus, install };