var express = require("express");
var path = require("path");
var initRoutes = require("./routes/routes");
var hbs = require("hbs");
var fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Register `hbs` as our view engine using its bound `engine()` function.
app.set("view engine", "hbs");
app.set("views", [
    path.join(__dirname, "views")
])
app.use('/static', express.static("static"))

var partialsDir = __dirname + "/views/partials";
var filenames = fs.readdirSync(partialsDir);

filenames.forEach(function (filename) {
    var matches = /^([^.]+).hbs$/.exec(filename);
    if (!matches) {
        return;
    }
    var name = matches[1];
    var template = fs.readFileSync(partialsDir + "/" + filename, "utf8");
    hbs.registerPartial(name, template);
});

initRoutes(app);


module.exports = app;
