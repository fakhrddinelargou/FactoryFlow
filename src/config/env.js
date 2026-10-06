require('dotenv').config();


const REQUIRED_ENV = [
    'PORT',
    'MONGO_URI',
    'JWT_SECRET',
    'JWT_EXPIRES_IN'
]

function checkEnv() {

    const FILTER_ENV = REQUIRED_ENV.filter(el => !process.env[el])

    
    if (FILTER_ENV.length > 0) {
        console.error(`Variables d'environnement manquantes: ${FILTER_ENV.join(', ')}`);
        process.exit(1);
    }
}




module.exports = checkEnv
