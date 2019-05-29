const { commonUtil } = require("../utils/commonUtils");
const route = require("../constants/endpoints");
const breakpointConfig = require("../../config/breakpointConfig");
const imgConfig = require("../../config/imgConfig");

module.exports = (req, res, next) => {
    console.log(":::REQUEST FOR UPLOAD:::")
    const location = commonUtil.imageLocation();
    res.render("layouts/main_cloud", {
        cloud: true,
        breakpoints: breakpointConfig.breakpoints
    });
}