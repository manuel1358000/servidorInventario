var mysql = require('mysql');
const config = require('../../config/authdb.key');
var mysql_pool = mysql.createPool({
    connectionLimit: 1000,
    host: 'root',
    user: config.user,
    password: config.password,
    database: 'db_inventario',
    port: 3307
});

module.exports.mysql_pool = mysql_pool;