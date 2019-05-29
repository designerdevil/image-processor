![Node version](https://img.shields.io/badge/node-%3E%3D10-green.svg) ![Express](https://img.shields.io/badge/server-express-yellow.svg)  ![Handlebars](https://img.shields.io/badge/template-handlebars-red.svg) ![Jimp](https://img.shields.io/badge/package-jimp-blue.svg)

# image-processor
Simple tool for batch processing the images with breakpoints and uploading it to Cloud. This tool uses [Jimp](https://github.com/oliver-moran/jimp) for image processing

## Modify Settings   
Modify and save setting as per your need. Setting includes viewport size, file prefix, file suffix

```
// Array of viewports, in which images will be converted
[
        {
            "width": 1024,
            "prefix": "1024_" 
        },
        {
            "width": 768,
            "suffix": "_768"
        }
]
```


## Upload File(s)
Upload single or multilple files. This will use the saved setting and generate the physical files based on the viewports provided in settings


![Setting/Upload](./docs/1-setting-upload.png)
![Setting/Upload](./docs/2-progress.png)

### View Uploded/Generated files
The details of original uploaded files can be viewed with the details like (original dimension, ratio of the image and image name).   
   
Image can be separately clicked for viewport versions, where cropping for specific viewports can also be performed. Additionaly dynamic responsive tage and base 64 for each image can also be generated


![View Files](./docs/3-view-images.png)

![View File Attributes](./docs/4-view-image-variations.png)

![View File Attributes](./docs/5-responsive-tag.png)

### Upload to Cloud
Feature for uploading the generated files to cloud storage is also available. Supported cloud services are Azure Blob Storage & Google Cloud Storage
     
![Upload to cloud](./docs/6-upload-to-cloud.png)
    
For Azure Blob storage, connection string of the storage account is needed.   
   
For Google cloud Storage, [these](./key/README.md) steps need to be followed.



## More information

Expectation for generating a lower dimension files to higher viewport is also in place. Files converted to higher viewport will be in degraded quality

![Resizing Patter](./docs/resize-pattern.png)