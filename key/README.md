## Provide GCP key here

If you want to use a GCP hook for generating the assets and uploading it on GCP account. A JSON key is required.   

**Note: Rename that file to key.json**   

### What should be inside of key.json
```
{
  "type": ********,
  "project_id": ********,
  "private_key_id": ********,
  "private_key": ********,
  "client_email": ********,
  "client_id": ********,
  "auth_uri": ********,
  "token_uri": ********,
  "auth_provider_x509_cert_url": ********,
  "client_x509_cert_url": ********,
}
```