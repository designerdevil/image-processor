const fs = require("fs");
const fileConfig = require("../../config/fileConfig");
const route = require("../constants/endpoints");
const imgConfig = require("../../config/imgConfig");

module.exports = (req, res, next) => {
    const event = req.query.event;
    const path = require("path");
    const storage = require("azure-storage");

    if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
        res.json({
            status: "fail",
            error: "Please provide AZURE connection string"
        });
        return;
    }
    const uploadObj = {
        isUploading: true,
        message: "files are getting uploaded"
    }
    fileConfig.status = Object.assign(fileConfig.status, uploadObj)

    const blobService = storage.createBlobService();

    const listContainers = async () => {
        return new Promise((resolve, reject) => {
            blobService.listContainersSegmented(null, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ message: `${data.entries.length} containers`, containers: data.entries });
                }
            });
        });
    };

    const createContainer = async (containerName) => {
        return new Promise((resolve, reject) => {
            blobService.createContainerIfNotExists(containerName, { publicAccessLevel: "blob" }, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ message: `Container "${containerName}" created` });
                }
            });
        });
    };

    const uploadLocalFile = async (containerName, filePath) => {
        return new Promise((resolve, reject) => {
            const fullPath = path.resolve(filePath);
            const blobName = path.basename(filePath);
            const options = {
                // contentSettings: {
                //     contentEncoding: 'gzip'
                // }
            }
            blobService.createBlockBlobFromLocalFile(containerName, blobName, fullPath, options, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ message: `-----------> File uploaded : ${blobName}` });
                }
            });
        });
    };

    const uploadFile = (containerName, dirName) => {
        const rootPath = "./uploads"
        let fileLen = fs.readdirSync(`${rootPath}/${dirName}`).length;
        fs.readdirSync(`${rootPath}/${dirName}`).forEach(async (file) => {
            response = await uploadLocalFile(containerName, `${rootPath}/${dirName}/${file}`);
            fileLen--
            console.log(response.message);
            if (fileLen <= 0) {
                fileConfig.status = Object.assign(fileConfig.status, {
                    isUploading: false,
                    message: "not uploading"
                })
                delete process.env.AZURE_STORAGE_CONNECTION_STRING
            }
        });
    }

    const execute = async () => {
        let response;
        response = await listContainers();
        fileConfig.breakpoint.forEach(async (item, index) => {
            fileConfig.status = Object.assign(fileConfig.status, uploadObj)
            const dirName = item;
            const containerName = `image-processor-221-${item}`
            const containerList = response.containers;
            const existingContainer = containerList.filter((container) => container.name === containerName)

            if (existingContainer.length == 0) {
                await createContainer(containerName);
                console.log(`Container ${containerName} created.`);
            } else {
                console.log(`Container ${containerName} existing.`);
            }

            uploadFile(containerName, dirName)
        });

    }

    execute().then(() => {
        // console.log(`"${dirObj.reportName}" ::::Pushing to Azure::::`)
    }).catch((err) => {
        console.log(":::::::::Found Error:::::::::")
        console.log(err)
        fileConfig.status = Object.assign(fileConfig.status, {
            errorCode: err.code,
            isUploading: false,
            message: "not uploading"
        })
        delete process.env.AZURE_STORAGE_CONNECTION_STRING
    })

    res.render("layouts/main_other", {
        progress: true,
        ctaTxt: 'Goto Home',
        chkStatusURL: route.checkCloudStatus,
        message: "Files uploaded on Azure",
        additionalInfo: `<div class="additional-info">Total breakpoints: ${fileConfig.breakpoint.length}&nbsp;&nbsp;&nbsp;Total files uploaded: ${imgConfig.images.length}</div><br>`,
        cta: route.root
    });

}