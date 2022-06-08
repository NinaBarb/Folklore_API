const jwt = require('jsonwebtoken');


module.exports = function (req, res, next) {
  const authcookie = req.cookies.jwt;
  jwt.verify(authcookie, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      res.status(401).send({ message: 'Access denied. Login to continue...' });
    }
    else if (data.id) {
      req.body.userID = data.id;
      next();
    }
  })
}