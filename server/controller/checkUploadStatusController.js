const imgConfig = require("../../config/imgConfig");

module.exports = (req, res, next) => {
    res.json(imgConfig.status)
}