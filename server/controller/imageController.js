const { imgProcess } = require("../utils/commonUtils");

module.exports = (req, res, next) => {
    const img = req.query.img
    const isBase64 = !!(req.query.base64)
    const isCrop = !!(req.query.crop)
    if (isBase64) {
        const path = req.query.base64.split("'");
        imgProcess.base64(path[1], res)
    }
    if (isCrop) {
        const query = req.query
        const path = query.path.split("'");
        const x = parseInt(query.x);
        const y = parseInt(query.y);
        const w = parseInt(query.w);
        const h = parseInt(query.h);
        imgProcess.crop(x, y, w, h, path[1], res, img)
    }
}