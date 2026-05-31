const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Pavan@260806',
    database: 'keylogger'
});

connection.connect((err) => {
    if(err){
        console.log(err);
    } else {
        console.log('Database Connected Successfully');
    }
});

module.exports = connection;