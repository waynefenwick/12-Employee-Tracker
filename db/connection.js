const mysql = require('mysql2');

const db = mysql.createConnection({
     host: 'localhost',
     user: 'root',
     password: '2$&@Cycling',
     database: 'employee_info_db',
});

module.exports = db;