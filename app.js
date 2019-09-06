const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
// require('dotenv').config();
const cors = require('cors');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');


function getConnection() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'chat'
    })
}

getConnection().connect(function(err) {
    if (!err) {
        console.log("Database is connected ... nn");
    } else {
        console.log("Error connecting database ... nn");
    }
});



// MORGAN WATCHING
app.use(morgan('short'));



// BODY PARSER
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// STATIC PAGE
// app.use(express.static('./public'));

// CORS
app.use(cors());

// ROUTES
app.post('/register1', (req, res) => {
    const name = req.body.inputName;
    const email = req.body.inputEmail;
    const password = req.body.inputPassword;
    const created_at = new Date();

    const query1 = "INSERT INTO reg_users (name,email,password,created_at) VALUES(?,?,?,?)";
    getConnection().query(query1, [name, email, password, created_at], (err, results, fields) => {
        if (err) {
            console.log(`Failed to register user: ${err}`);
            res.sendStatus(500);
            return
        } else {
            console.log(results.insertId);
            res.send(results);
        }

    });


});
// ROUTES
app.post('/login', (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    const query1 = "SELECT * FROM reg_users WHERE email = ?";
    getConnection().query(query1, [email], (err, results, fields) => {
        if (err) {
            console.log("error ocurred", error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            });
        } else {
            console.log('The solution is: ', results);
            if (results.length > 0) {
                if (results[0].password == password) {

                    // token
                    let token = jwt.sign({ name: results[0].name }, 'mySecret', { expiresIn: '3h' });

                    res.send({
                        code: 200,
                        success: 'Login Sucessfull',
                        token: token

                    });
                } else {
                    res.send({
                        "code": 204,
                        "success": "Email and password does not match"
                    });
                }
            } else {
                res.send({
                    code: 204,
                    success: 'Email does not exits'
                });
            }

        }



    });


});


// USERNAME
app.get('/username', verifyUser, (req, res, next) => {
    res.send({
        code: 200,
        success: 'Login Sucessfull',
        data: decodedToken.name
    });
});

var decodedToken = '';

function verifyUser(req, res, next) {
    let token = req.query.token;
    jwt.verify(token, 'mySecret', (err, tokenData) => {
        if (err) {
            res.send({
                code: 400,
                failed: "Unauthorized Request"
            });
        }
        if (tokenData) {
            decodedToken = tokenData;
            next();
        }
    });
}

app.get('/users', (req, res) => {
    const myquery = "SELECT * FROM users WHERE email != ''";
    getConnection().query(myquery, (err, rows, feilds) => {
        res.send(JSON.stringify(rows)); // console.log(JSON.stringify(rows.));
    });
});


// "user_id":2,"first_name":"saint","last_name":"zion","email":"st@gmail.com",
// "password":"$2y$10$ONuROLrgOsGtO7UcXdGPP.7rXphG1e1Rr3UEEgEh6E7kQBxzdInHC","hash"

// PORT 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App running om port ${PORT}`);
    // console.log(Date.now());
});