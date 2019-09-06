const jwt = require('jsonwebtoken');

let resultsNotFound = {
    "errorCode": "0",
    "errorMessage": "Some server  Error ",
    "rowCount": "0",
    "data": ''
}
module.exports = {
    checkInputDataNull: function(req, res) {
        if (!req.body) {
            res.send(resultsNotFound);
        }
    },

    // email
    checkInputDataQuality: function(req, res) {
        resultsNotFound['errorMessage'] = 'There is no Data from Client';
        if (req.body.inputEmail === '') {
            return res.send(resultsNotFound);
        }
    },

    // Token
    checkJWTToken: function(req, res) {
        const token = req.headers.token;
        if (!token) { res.sendStatus(400); }
        const decoded = jwt.verify(
            token.replace('Bearer ', ''),
            process.env.JWT_SECRET
        );
        resultsNotFound['errorMessage'] = 'Your Token is invalid please logout and login again';
        if (!decoded) { return res.send(resultsNotFound) }
        return decoded.email;
    }

}