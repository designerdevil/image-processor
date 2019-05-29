const express = require("express");
const path = require("path");
const initRoutes = require("./routes");
const hbs = require("hbs");
const multer = require('multer');
const { allowedFiles } = require('../config')
const fs = require("fs");

const app = express();
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        const fileAttributes = file.originalname.split('.');
        const extension = fileAttributes[fileAttributes.length - 1]
        if (allowedFiles.indexOf(extension) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        // callback(null, `${file.fieldname}-${Date.now()}.${extension}`);
        callback(null, file.originalname)
    }
});

const upload = multer({ storage: storage }).array('imageAsset');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register `hbs` as our view engine using its bound `engine()` function.
app.set("view engine", "hbs");
app.set("views", [
    path.join(__dirname, "views")
])
app.use('/static', express.static("static"))
app.use('/uploads', express.static("uploads"))

const partialsDir = __dirname + "/views/partials";
const filenames = fs.readdirSync(partialsDir);

filenames.forEach(function (filename) {
    const matches = /^([^.]+).hbs$/.exec(filename);
    if (!matches) {
        return;
    }
    const name = matches[1];
    const template = fs.readFileSync(partialsDir + "/" + filename, "utf8");
    hbs.registerPartial(name, template);
});

initRoutes(app, upload);


module.exports = app;
