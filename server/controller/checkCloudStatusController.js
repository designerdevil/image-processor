const fileConfig = require("../../config/fileConfig");

module.exports = (req, res, next) => {
    res.json(fileConfig.status)
}