const { commonUtil } = require("../utils/commonUtils");
const route = require("../constants/endpoints");
const { types } = require("../constants/appConstants");
const fileConfig = require("../../config/fileConfig");
const imgConfig = require("../../config/imgConfig");

module.exports = (req, res, next) => {
    console.log(":::REQUEST FOR UPLOAD:::")
    const { breakpoints, service, connection } = req.body
    const files = []
    const imgIterator = (breakpoint) => {
        imgConfig.images.forEach((file, fileIndex) => {
            files.push({
                name: file.name,
                path: breakpoint
            })
        })
    }
    if (Array.isArray(breakpoints)) {
        breakpoints.forEach((breakpoint, breakpointIndex) => {
            imgIterator(breakpoint)
        })
        fileConfig.breakpoint = [...breakpoints]
    } else {
        imgIterator(breakpoints)
        fileConfig.breakpoint = [breakpoints]
    }
    fileConfig.files = [...files]

    if (service == types.azure) {
        process.env.AZURE_STORAGE_CONNECTION_STRING = connection
        res.redirect(route.azure)
    } else if (service == types.gcp) {
        process.env.GCP_PROJECT_STRING = connection
        res.redirect(route.gcp)
    }
    // res.send(files)
}