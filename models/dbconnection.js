let mysql = require('mysql');
let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root'
        // database: 'chat'
});

con.connect(function(err) {
    if (err) throw err;
    console.log('DB Connected');
});

module.exports = con;