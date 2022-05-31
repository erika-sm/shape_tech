const jwt = require("jsonwebtoken");

const { JWTS } = process.env;

//checking and authorizing access if jwt exists
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, JWTS, (err, decodedToken) => {
      if (err) {
        res.status(400).json({ status: 400, valid: false });
      } else {
        res.status(200).json({ status: 200, valid: true });
        next();
      }
    });
  } else {
    res.status(400).json({ status: 400, valid: false });
  }
};

//checking currently logged in user
const loggedInUser = (req, res, next) => {
  const token = req.cookies.jwt;

  jwt.verify(token, JWTS, (err, decodedToken) => {
    res.status(200).json({ status: 200, data: decodedToken, err: err });
  });
};

module.exports = { requireAuth, loggedInUser };
