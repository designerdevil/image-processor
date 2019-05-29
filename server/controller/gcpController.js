const fs = require("fs");
var path = require("path");
const fileConfig = require("../../config/fileConfig");
const { Storage } = require('@google-cloud/storage');
const route = require("../constants/endpoints");
const imgConfig = require("../../config/imgConfig");

module.exports = (req, res, next) => {
    if (!process.env.GCP_PROJECT_STRING) {
        res.json({
            status: "fail",
            error: "Please provide GCP Project name in Connection string header"
        });
        return;
    }
    const uploadObj = {
        isUploading: true,
        message: "files are getting uploaded"
    }
    fileConfig.status = Object.assign(fileConfig.status, uploadObj)
    const storage = new Storage({
        projectId: process.env.GCP_PROJECT_STRING,
        keyFilename: './key/key.json'
    })

    const listBuckets = async () => {
        const [buckets] = await storage.getBuckets();
        const bucketResolver = new Promise((resolve, reject) => {
            resolve(buckets)
        })
        return bucketResolver
    }

    const uploadLocalFile = async (bucketName, filePath) => {
        const bucket = storage.bucket(bucketName)
        const fileName = path.basename(filePath);
        const file = bucket.file(fileName);
        bucket.upload(filePath, {
            gzip: true,
            metadata: {
                cacheControl: 'public, max-age=31536000',
            }
        }).then(() => {
            file.makePublic()
        })
    };

    const uploadFile = (bucketName, dirName) => {
        const rootPath = "./uploads"
        let fileLen = fs.readdirSync(`${rootPath}/${dirName}`).length;
        fs.readdirSync(`${rootPath}/${dirName}`).forEach(async (file) => {
            uploadLocalFile(bucketName, `${rootPath}/${dirName}/${file}`);
            fileLen--
            console.log(`-----------> File uploaded : ${rootPath}/${dirName}/${file}`)
            if (fileLen <= 0) {
                fileConfig.status = Object.assign(fileConfig.status, {
                    isUploading: false,
                    message: "not uploading"
                })
                delete process.env.GCP_PROJECT_STRING
            };
        });
    }
    const projectName = process.env.GCP_PROJECT_STRING;
    listBuckets().then((buckets) => {
        fileConfig.breakpoint.forEach((item, index) => {
            fileConfig.status = Object.assign(fileConfig.status, uploadObj)
            const dirName = item;
            const bucketName = `${projectName}-${item}`
            const existingBucket = buckets.filter((item) => item.name === bucketName)
            if (existingBucket.length > 0) {
                console.log(`Bucket ${bucketName} existing.`);
                uploadFile(bucketName, dirName)
            } else {
                storage.createBucket(bucketName, {
                    cors: [
                        {
                            origin: ["*"],
                            method: ["GET"],
                            responseHeader: ["Content-Type"],
                            maxAgeSeconds: 3600
                        }
                    ]
                }).then(() => {
                    console.log(`Bucket ${bucketName} created.`);
                    uploadFile(bucketName, dirName)
                }).catch(err => {
                    console.log(":::::::::Found Error:::::::::")
                    console.log(err)
                    fileConfig.status = Object.assign(fileConfig.status, {
                        errorCode: err.code,
                        isUploading: false,
                        message: "not uploading"
                    })
                    delete process.env.GCP_PROJECT_STRING
                });
            }

        })
    }).catch((err) => console.log(err))

    res.render("layouts/main_other", {
        progress: true,
        ctaTxt: 'Goto Home',
        chkStatusURL: route.checkCloudStatus,
        message: "Files uploaded on GCP",
        additionalInfo: `<div class="additional-info">Total breakpoints: ${fileConfig.breakpoint.length}&nbsp;&nbsp;&nbsp;Total files uploaded: ${imgConfig.images.length}</div><br>`,
        cta: route.root
    });



}