const mysql = require('mysql2/promise'); // Используем mysql2/promise для поддержки промисов
const dbConfig = require('./database.js');

const pool = mysql.createPool({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
});

module.exports = pool;
