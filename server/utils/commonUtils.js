const fs = require("fs");
const path = require("path");
const { rimraf } = require("rimraf");
const route = require("../constants/endpoints");
const { Jimp, loadFont } = require("jimp");
const { SANS_128_WHITE } = require("jimp/fonts");
const { imgDir } = require("../constants/appConstants");
const breakpointConfig = require("../../config/breakpointConfig");
const imgConfig = require("../../config/imgConfig");
const zlib = require("zlib");

const commonUtil = {
    imageLocation: () => path.join(__dirname, `../../${imgDir.root}`),
    makeDir: (location, dirName) => {
        const dir = `${location ? location + '/' : ''}${dirName}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        return dirName;
    },
    removeAllFiles: async (directory) => {
        await rimraf(`${directory}/`, { glob: true }, function () { console.log(":::Previous File Removed:::"); });
        await commonUtil.makeDir(null, directory);
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
    crop: async (x, y, w, h, path, res, img) => {
        const imageLocation = commonUtil.imageLocation();
        const fullpath = `${imageLocation}/${path}`;
        const image = await Jimp.read(fullpath);
        const pathAttr = path.split('/')
        const imgExtn = pathAttr[2].split('.');
        const imgName = `${imgExtn.splice(0, imgExtn.length - 1)}_cropped.${imgExtn}`;
        const newFullPath = `${imageLocation}/${pathAttr[1]}/${imgName}`
        await image.crop({x, y, w, h})
            .write(newFullPath);
        const imgObj = imgConfig.images.filter(item => (item.name === img))[0]
        if ( !( 'cropped' in imgObj ) ) imgObj['cropped'] = [];
        const imgpath = `/${pathAttr[1]}/${imgName}`
        if (imgObj.cropped.includes(imgpath) === false) imgObj.cropped.push(imgpath);
        res.redirect(`${route.adjust}?img=${img}`)
    },
    base64: async (path, res) => {
        const imageLocation = commonUtil.imageLocation();
        const image = await Jimp.read(`${imageLocation}/${path}`);
        // console.log(image);
        const data = await image.getBase64(image.mime);
        res.send(data);
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
            imgObj.forEach(async (item, index) => {
                const imgObj = imgConfig.images[index];
                const imgExtn = imgObj.name.split('.');
                const imgName = imgExtn.splice(0, imgExtn.length - 1);
                if (item.bitmap.width > breakpoint) {
                    item.clone()
                        .resize({ w: breakpoint, h: Jimp.AUTO })
                        .write(`${imageLocation}/${dir}/${prefix}${imgName.join('')}${suffix}.${imgExtn.join('')}`)
                } else {
                    const font = await loadFont(SANS_128_WHITE);
                    item.clone()
                            .resize({ w: breakpoint, h: Jimp.AUTO })
                            .greyscale()
                            .print({ font, x: 10, y: 10, text: "Degraded" })
                            .fade(0.5)
                            .write(`${imageLocation}/${dir}/${prefix}${imgName.join('')}${suffix}.${imgExtn.join('')}`)
                }
            })
        });
    },
    resize: (dir, img, imageLocation, imgName) => {
        const thumbs = commonUtil.makeDir(imageLocation, dir)
        img.clone()
            .resize({ w: 320, h: Jimp.AUTO })
            .write(`${imageLocation}/${thumbs}/${imgName}`)
    }
}
module.exports = {
    commonUtil,
    mathUtil,
    imgProcess
};