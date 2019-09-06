const pool = require('./dbconnection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let resultNotFound = {
    "errorCode": "0",
    "errorMessage": "Operation not successful",
    "rowCount": "0",
    "data": ''
};

let resultsFound = {
    "errorCode": "1",
    "errorMessage": "Operation Successful",
    "rowCount": "0",
    "data": ''
};

module.exports = {

    // REGISTER USER
    createUser: function(req, res) {
        pool.getConnection(function(err, connection) {
            if (err) throw err;

            bcrypt.hash(req.body.inputPassword, saltRounds, function(err, hash) {
                let sql = 'INSEART INTO user SET ?';
                let values = { 'name': req.body.inputName, 'email': req.body.inputEmail, 'password': hash, 'createdAt': new Date(), 'updatedAt': new Date() }
                connection.query(sql, values, function(error, results, fields) {
                    if (error) {
                        resultNotFound['errorMessage'] = 'Email Exist?';
                        return res.send(resultNotFound);
                    } else {
                        return res.send(resultsFound);
                    }
                });
            });
            //
            connection.release();
            if (error) throw error;
        });
    },

    // LOGIN USER
    loginUser: function(req, res) {
        pool.getConnection(function(err, connection) {
            if (err) throw err;

            let sql = 'SELECT * FROM user WHERE email = ?';
            let values = [req.body.inputEmail];

            connection.query(sql, values, function(error, results, fields) {
                if (error) {
                    resultNotFound['errorMessage'] = 'Sorry something went wrog when loging in user, try again';
                    return res.send(resultNotFound);
                }
                if (results == '') {
                    resultNotFound['errorMessage'] = 'User Not Found';
                    return res.send(resultNotFound);
                }

                bcrypt.compare(req.body.inputPassword, results[0].password, function(err, result) {
                    if (result == true) {
                        let token = {
                            'token': jwt.sign({ email: req.body.inputEmail },
                                process.env.JWT_SECRET, { expiresIn: '30d' }
                            )
                        }
                        resultsFound['data'] = token;
                        return res.send(resultsFound);
                    } else {
                        resultNotFound['errorMessage'] = 'Incorrect Password';
                        return res.send(resultNotFound);
                    }
                });
            });

            //
            connection.release();
            if (error) throw error;
        });
    },

    // GET USER
    getUser: function(req, res) {
        pool.getConnection(function(err, connection) {
            if (err) throw err;

            let sql = 'SELECT * FROM user WHERE email = ?';
            let values = [input];

            connection.query(sql, values, function(error, results, fields) {

                if (error) {
                    resultNotFound['errorMessage'] = 'Sorry something went wrog when getinig user, try again';
                    return res.send(resultNotFound);
                }
                if (results == '') {
                    resultNotFound['errorMessage'] = 'User Not  Found (when we try getting user)';
                    return res.send(resultNotFound);
                }
                resultsFound['data'] = results[0];
                res.send(resultsFound);

            });

            //
            connection.release();
            if (error) throw error;
        });
    }


}