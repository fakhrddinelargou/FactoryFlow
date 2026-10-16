const {listMovements} = require('../services/stockMovment');


const list = async (req, res) => {
  const result = await listMovements(req.query);
  res.status(200).json({ success: true, ...result });
};

module.exports = {list}