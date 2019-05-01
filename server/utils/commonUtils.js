const fs = require("fs");
const rimraf = require("rimraf");
var zlib = require("zlib");

const commonUtil = {
    writeFile: function (path, content, shouldGzip) {
        fs.writeFile(path, content, function (fileerr) {
            if (fileerr) {
                return console.log(`Unable to write file ::> ${fileerr}`);
            }
            if (shouldGzip) {
                var gzip = zlib.createGzip();
                var readStream = fs.createReadStream(path);
                var writeStream = fs.createWriteStream(`${path}.js`);
                readStream.pipe(gzip).pipe(writeStream);
                rimraf(path, function () {
                    fs.rename(`${path}.js`, path, function (err) {
                        if (err) 
                        console.log(`ERROR :::> ${err}`);
                    });
                });
            }
        });
    },
    downloadFile: function (res, stream, name = "file") {
        let file = Buffer.from(stream, "utf8");
        res.writeHead(200, {
            "Content-Type": "text/html",
            "Content-disposition": `attachment; filename=${name}.html`,
            "Content-Length": file.length
        });
        res.end(file);
    },
    makeNewDir: function () {
        const dateStamp = Date.now()
        console.log(commonUtil.getMomentDate(dateStamp))
        var folderName = `report-on-${commonUtil.getMomentDate(dateStamp)}`
        const date = new Date(parseInt(dateStamp));
        var dir = `./public/${folderName}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
            return {
                dirName: dir,
                folderName: folderName,
                date
            };
        }
        return "./public";
    }
}

module.exports = commonUtil;