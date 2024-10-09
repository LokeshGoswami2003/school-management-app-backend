const { error } = require("../utils/responseWrapper");

module.exports = (req, res, next) => {
    if (req.user.userType !== 'admin') {
        return res.send(error(403, "Access denied. Admins only."));
    }
    next();
};