const fs = require("fs");
const { Jimp } = require("jimp");
const route = require("../constants/endpoints");
const { commonUtil, imgProcess } = require('../utils/commonUtils')
const { allowedFiles } = require('../../config')
const { imgDir } = require("../constants/appConstants")
const imgConfig = require("../../config/imgConfig");
const breakpointConfig = require("../../config/breakpointConfig");

module.exports = (req, res, next) => {
    console.log("::::REQUEST FOR PROCESS::::")
    const imageLocation = commonUtil.imageLocation();
    let fileSize = 0;
    const images = fs.readdirSync(imageLocation).filter((file) => {
        const fileAttributes = file.split('.');
        const extension = fileAttributes[fileAttributes.length - 1]
        if (allowedFiles.indexOf(extension) !== -1) {
            const stats = fs.statSync(`${imageLocation}/${file}`);
            const fileSizeInBytes = stats.size;
            fileSize += fileSizeInBytes
            return true
        }
        return false
    });
    const uploadObj = {
        isUploading: true,
        message: "files are getting uploaded"
    }
    imgConfig.status = Object.assign(imgConfig.status, uploadObj);
    Promise.all(
        images.map((item) => Jimp.read(`${imageLocation}/${item}`))
    ).then((items) => {
        imgConfig.processing = true;
        const imgObj = items.map((item, index) => {
            item.tags = {}
            const imgName = images[index];
            return imgProcess.imgAttr(item, imageLocation, imgName);
        })
        imgConfig.images = imgObj;
        
        imgProcess.generateBreakpoints(items);
        imgConfig.status = Object.assign(imgConfig.status, {
            isUploading: false,
            message: "files are uploaded"
        });
    });

    res.render("layouts/main_other", {
        progress: true,
        ctaTxt: 'View uploaded',
        chkStatusURL: route.checkUploadStatus,
        message: "Files uploaded and processed",
        additionalInfo: `<div class="additional-info">Total breakpoints: ${breakpointConfig.breakpoints.length}&nbsp;&nbsp;&nbsp;Total files uploaded: ${images.length} &nbsp;&nbsp;&nbsp;Total files size: ${(fileSize / 1000000.0).toFixed(2)}Mb</div><br>`,
        cta: route.processed
    });
}