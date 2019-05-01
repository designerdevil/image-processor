const settingsController = require("../controller/settingsController");
const route = require("../constants/endpoints");


module.exports = function (app) {
        app.get(route.root, settingsController)
        app.get("*", (req, res, next) => {
            res.redirect(route.root)
        })
};




