const installationService = require('../services/installation');
const AppError = require('../utils/AppError');


const getStatus =async (req, res) => {
  const status = await installationService.getStatus();
  res.status(200).json({ success: true, data: status });
};

const install = async (req, res) => {
    console.log(req.body);
    const validatoinData = userSchema.safeParse(req.body)
    if(!validatoinData.success){
     throw new AppError(validatoinData.error.issues?.[0]?.message , 400)
    }
  const { first_name, last_name, email, password } = validatoinData.data;

  
  const admin = await installationService.install({
    first_name,
    last_name,
    email,
    password,
  });

  res.status(201).json({
    success: true,
    message: 'Installation réussie',
    data: admin,
  });
};

module.exports = { getStatus, install };