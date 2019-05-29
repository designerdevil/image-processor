const route = require("../constants/endpoints");
const breakpointConfig = require("../../config/breakpointConfig");

module.exports = (req, res, next) => {
    console.log(":::REQUEST FOR SAVE SETTINGS:::")
    const data = req.body
    const settings = JSON.parse(data.settings);
    breakpointConfig.breakpoints = [...settings]
    res.redirect(route.upload);
}