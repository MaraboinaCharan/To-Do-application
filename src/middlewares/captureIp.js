// src/middlewares/captureIp.js
const captureIp = (req, res, next) => {
    req.clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(req.clientIp)
    next();
  };
  
  export default captureIp;
  