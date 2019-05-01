
### HOW TO DEPLOY  

Steps to deploy the application to Kubernetes through GCP Cloud shell.

***STEP 1:***   
clone the repository
```git clone https://github.com/designerdevil/lighthouse.git```

***STEP 2:***   
build an image from docker
```docker build -t gcr.io/<PROJECT ID>/<IMAGE NAME>:<TAG> .```

***STEP 3:***   
push the image to GCP image repository
```docker push gcr.io/<PROJECT ID>/<IMAGE NAME>:<TAG>```

***STEP 4:***   
Define cluster with zone + node
```gcloud container clusters create <CLUSTER NAME> --zone <ZONE> --num-nodes=<NUMBER OR NODES>```

***STEP 5:***   
Run the image in kubernetes container
```kubectl run lighthouse-web --image=gcr.io/<PROJECT ID>/<IMAGE NAME>:<TAG> --port 4002```

DONE!!!