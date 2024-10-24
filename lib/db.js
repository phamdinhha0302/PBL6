const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Khanh05062003',
    database: 'PBL6'
});

connection.connect(function (error) {
    if (!!error) {
        console.log(error);
    } else {
        console.log('Connected!:)');
    }
});

module.exports = connection;