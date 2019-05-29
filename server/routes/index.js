const route = require("../constants/endpoints");
const processController = require("../controller/processController");
const viewProcessController = require("../controller/viewProcessController");
const adjustController = require("../controller/adjustController");
const imageController = require("../controller/imageController");
const viewUploadController = require("../controller/viewUploadController");
const saveSettingsController = require("../controller/saveSettingsController");
const viewCloudController = require("../controller/viewCloudController");
const cloudController = require("../controller/cloudController");
const gcpController = require("../controller/gcpController");
const checkCloudStatusController = require("../controller/checkCloudStatusController");
const checkUploadStatusController = require("../controller/checkUploadStatusController");
const azureController = require("../controller/azureController");


module.exports = function (app, upload) {
    app.get(route.root, (req, res, next) => {
        res.render("layouts/main", {
            root: true
        });
    })
    app.get(route.upload, viewUploadController);
    app.get(route.process, processController);
    app.get(route.processed, viewProcessController);
    app.post(route.uploadapi, function (req, res) {
        upload(req, res, function (err) {
            if (err) {
                console.log(err)
                return res.end("Error uploading file.");
            }
            res.redirect(route.process);
        });
    });
    app.get(route.adjust, adjustController);
    app.get(route.image, imageController);
    app.post(route.settingsapi, saveSettingsController);
    app.get(route.cloud, viewCloudController);
    app.post(route.pushimages, cloudController);
    app.get(route.gcp, gcpController);
    app.get(route.checkCloudStatus, checkCloudStatusController);
    app.get(route.checkUploadStatus, checkUploadStatusController);
    app.get(route.azure, azureController);
    // app.get("*", (req, res, next) => {
    //     res.redirect(route.root)
    // })
};




