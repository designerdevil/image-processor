const imgConfig = require("../../config/imgConfig");

module.exports = (req, res, next) => {
    res.render("layouts/main", {
        process: true,
        images: imgConfig.images
    });
}