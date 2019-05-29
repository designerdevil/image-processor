const imgConfig = require("../../config/imgConfig");
const breakpointConfig = require("../../config/breakpointConfig");

module.exports = (req, res, next) => {
    const img = req.query.img;
    const imgObj = imgConfig.images.filter(item => (item.name === img))[0]
    const breakpoints = breakpointConfig.breakpoints;
    const dirs = []
    breakpoints.forEach((item) => {
        const breakpoint = item.width;
        const suffix = item.suffix || '';
        const prefix = item.prefix || '';
        const imgExtn = imgObj.name.split('.');
        const imgName = imgExtn.splice(0, imgExtn.length - 1); 
        dirs.push({
            dimension: imgObj.dimension,
            imgRoot: imgObj.imgRoot,
            dir: breakpoint,
            width: breakpoint,
            type: breakpoint,
            img: `${prefix}${imgName.join('')}${suffix}.${imgExtn.join('')}`,
            baseImg: img
        })
    })
    res.render("layouts/main_adjust", {
        adjust: true,
        images: dirs,
        primaryImg: dirs[dirs.length-1],
        uploadedObj: imgObj
    });
}