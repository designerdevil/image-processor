const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const route = require("../constants/endpoints");
const Jimp = require("jimp");
const { imgDir } = require("../constants/appConstants");
const breakpointConfig = require("../../config/breakpointConfig");
const imgConfig = require("../../config/imgConfig");
var zlib = require("zlib");

const commonUtil = {
    imageLocation: () => path.join(__dirname, `../../${imgDir.root}`),
    makeDir: (location, dirName) => {
        var dir = `${location}/${dirName}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        return dirName;
    },
    removeAllFiles: (directory) => {
        rimraf(`${directory}/**/*`, function () { console.log(":::Previous File Removed:::"); });
    }
}
const mathUtil = {
    hcf: (x, y) => {
        if ((x < 1 || y < 1) && (x != Math.round(x) || y != Math.round(y))) {
            return 0;
        }
        while (Math.max(x, y) % Math.min(x, y) != 0) {
            if (x > y) x %= y;
            else y %= x;
        }
        return Math.min(x, y);
    },
    ratio: (x, y) => {
        const hcf = mathUtil.hcf(x, y);
        return [x / hcf, y / hcf]
    }
}
const imgProcess = {
    crop: (x, y, w, h, path, res, img) => {
        const imageLocation = commonUtil.imageLocation();
        const fullpath = `${imageLocation}/${path}`
        Jimp.read(fullpath, function (err, image) {
            if (err)
                console.log(err)
            const pathAttr = path.split('/')
            const imgExtn = pathAttr[2].split('.');
            const imgName = `${imgExtn.splice(0, imgExtn.length - 1)}_cropped.${imgExtn}`;
            const newFullPath = `${imageLocation}/${pathAttr[1]}/${imgName}`
            image.crop(x, y, w, h)
                .write(newFullPath);
            const imgObj = imgConfig.images.filter(item => (item.name === img))[0]
            if ( !( 'cropped' in imgObj ) ) imgObj['cropped'] = [];
            const imgpath = `/${pathAttr[1]}/${imgName}`
            if (imgObj.cropped.includes(imgpath) === false) imgObj.cropped.push(imgpath);
            res.redirect(`${route.adjust}?img=${img}`)
        });
    },
    base64: (path, res) => {
        const imageLocation = commonUtil.imageLocation();
        Jimp.read(`${imageLocation}/${path}`, function (err, image) {
            image.getBase64(Jimp.AUTO, function (err, data) {
                if (err)
                    console.log(err)
                res.send(data);
            });
        });
    },
    imgAttr: (item, imageLocation, imgName) => {
        const imgWidth = item.bitmap.width;
        const imgHeight = item.bitmap.height;
        imgProcess.resize(imgDir.thumb, item, imageLocation, imgName);
        return {
            dimension: `${imgWidth} x ${imgHeight}`,
            ratio: mathUtil.ratio(imgWidth, imgHeight).join(':'),
            name: imgName,
            imgDir: imgDir.thumb,
            imgRoot: imgDir.root
        }
    },
    generateBreakpoints: (imgObj) => {
        console.log("::::Generating Breakpoint Images::::")
        const imageLocation = commonUtil.imageLocation();
        const breakpoints = breakpointConfig.breakpoints;
        breakpoints.forEach((item) => {
            const suffix = item.suffix || '';
            const prefix = item.prefix || '';
            const breakpoint = item.width;
            const dir = commonUtil.makeDir(imageLocation, breakpoint)
            imgObj.forEach((item, index) => {
                const imgObj = imgConfig.images[index];
                const imgExtn = imgObj.name.split('.');
                const imgName = imgExtn.splice(0, imgExtn.length - 1);
                if (item.bitmap.width > breakpoint) {
                    item.clone()
                        .resize(breakpoint, Jimp.AUTO)
                        .write(`${imageLocation}/${dir}/${prefix}${imgName.join('')}${suffix}.${imgExtn.join('')}`)
                } else {
                    Jimp.loadFont(Jimp.FONT_SANS_16_WHITE).then(font => {
                        item.clone()
                            .resize(breakpoint, Jimp.AUTO)
                            .greyscale()
                            .print(font, 10, 10, 'Degraded')
                            .fade(0.5)
                            .write(`${imageLocation}/${dir}/${prefix}${imgName.join('')}${suffix}.${imgExtn.join('')}`)
                    });
                }
            })
        });
    },
    resize: (dir, img, imageLocation, imgName) => {
        const thumbs = commonUtil.makeDir(imageLocation, dir)
        img.clone()
            .resize(320, Jimp.AUTO)
            .write(`${imageLocation}/${thumbs}/${imgName}`)
    }
}
module.exports = {
    commonUtil,
    mathUtil,
    imgProcess
};