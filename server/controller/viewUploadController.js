const { commonUtil } = require("../utils/commonUtils");
const route = require("../constants/endpoints");
const configData = require("../../config/breakpointConfig");
const imgConfig = require("../../config/imgConfig");

module.exports = (req, res, next) => {
    const location = commonUtil.imageLocation();
    commonUtil.removeAllFiles(location)
    imgConfig.images = []
    res.render("layouts/main", {
        upload: true,
        uploadapi: route.uploadapi,
        settingsapi: route.settingsapi,
        breakpoints: JSON.stringify(configData.breakpoints)
    });
}