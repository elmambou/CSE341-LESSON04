const checkLogin = (req, res, next) => {
    if (!req.oidc.isAuthenticated()) {
      return res.status(401).send({
        error: 'Not authorized to change data without login.',
        login: "https://cse341-l7.onrender.com/login"
      });
    }
    next();
  };
  
  module.exports = {checkLogin};