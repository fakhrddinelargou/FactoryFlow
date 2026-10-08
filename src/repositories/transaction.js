const mongoose =  require('mongoose');

const withTransaction = async (callback) => {
  const session = await mongoose.startSession();      

  try {
    session.startTransaction();

    const result = await callback(session);           

    await session.commitTransaction();                
    return result;
  } catch (err) {
    await session.abortTransaction();                 
    throw err;
  } finally {
    await session.endSession();                       
  }
};

module.exports = withTransaction