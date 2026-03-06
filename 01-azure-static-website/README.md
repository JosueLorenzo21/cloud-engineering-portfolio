# Azure Static Website with Azure Front Door

This project demonstrates how to deploy a static website in Azure using cloud infrastructure services.

## Architecture

User → Azure Front Door → Origin Group → Azure Storage Static Website

The static website files are stored in the `$web` container inside Azure Storage.

Azure Front Door acts as a global CDN that routes user traffic to the origin.

## Services Used

Azure Storage  
Hosts static files such as HTML, CSS, and JavaScript.

Azure Front Door  
Provides global CDN capabilities and HTTPS access.

Azure CLI  
Used to automate infrastructure deployment.

## Deployment

Login to Azure:

az login

Run the deployment script:

./scripts/deploy.sh

The script automatically creates:

Resource Group  
Storage Account  
Static Website configuration  
Azure Front Door profile  
Origin group  
Route  

## Testing

Check the response headers:

curl -I https://your-endpoint.azurefd.net

Expected response:

HTTP/1.1 200 OK

## Learning Objectives

Static website hosting in Azure  
CDN architecture  
Infrastructure automation using CLI  
Cloud architecture documentation