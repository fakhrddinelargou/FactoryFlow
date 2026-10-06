const app = require('./src/app');
require('dotenv').config();
const connectDB = require('./src/config/db');
const checkEnv = require('./src/config/env');
const PORT = process.env.PORT || 3000; 

// REQUIRED ENV
checkEnv()


// NOT FOUND DIRCTION

connectDB().then(()=>{
    app.listen(PORT , ()=>{
    console.log(`connection successfuly with PORT : ${PORT}`)
    })
}).catch(err => {console.log(err);
})

