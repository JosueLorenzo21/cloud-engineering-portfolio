#!/bin/bash

set -e

echo "Starting Azure Static Website deployment..."

# VARIABLES
RESOURCE_GROUP="rg-static-site-cli"
LOCATION="eastus"

STORAGE_NAME="staticweb$RANDOM"
FRONTDOOR_NAME="fd-static-site-$RANDOM"
ENDPOINT_NAME="endpoint-static-$RANDOM"

ORIGIN_GROUP="og-static-site"
ORIGIN_NAME="origin-storage"

echo "Resource Group: $RESOURCE_GROUP"
echo "Storage Account: $STORAGE_NAME"
echo "Front Door Profile: $FRONTDOOR_NAME"

# CREATE RESOURCE GROUP
echo "Creating Resource Group..."
az group create \
--name $RESOURCE_GROUP \
--location $LOCATION

# CREATE STORAGE ACCOUNT
echo "Creating Storage Account..."
az storage account create \
--name $STORAGE_NAME \
--resource-group $RESOURCE_GROUP \
--location $LOCATION \
--sku Standard_LRS \
--kind StorageV2

# ENABLE STATIC WEBSITE
echo "Enabling Static Website..."
az storage blob service-properties update \
--account-name $STORAGE_NAME \
--static-website \
--index-document index.html \
--404-document index.html

# GET STORAGE KEY
ACCOUNT_KEY=$(az storage account keys list \
--account-name $STORAGE_NAME \
--resource-group $RESOURCE_GROUP \
--query "[0].value" \
--output tsv)

# UPLOAD WEBSITE FILES
echo "Uploading website files..."
az storage blob upload-batch \
--account-name $STORAGE_NAME \
--account-key $ACCOUNT_KEY \
--destination '$web' \
--source ./website

# CREATE FRONT DOOR PROFILE
echo "Creating Front Door Profile..."
az afd profile create \
--profile-name $FRONTDOOR_NAME \
--resource-group $RESOURCE_GROUP \
--sku Standard_AzureFrontDoor

# CREATE ENDPOINT
echo "Creating Front Door Endpoint..."
az afd endpoint create \
--endpoint-name $ENDPOINT_NAME \
--profile-name $FRONTDOOR_NAME \
--resource-group $RESOURCE_GROUP

# GET STORAGE ENDPOINT
STORAGE_HOST=$(az storage account show \
--name $STORAGE_NAME \
--query "primaryEndpoints.web" \
--output tsv | sed 's|https://||' | sed 's|/||')

# CREATE ORIGIN GROUP
echo "Creating Origin Group..."
az afd origin-group create \
--origin-group-name $ORIGIN_GROUP \
--profile-name $FRONTDOOR_NAME \
--resource-group $RESOURCE_GROUP \
--probe-request-type GET \
--probe-protocol Https \
--probe-path "/" \
--probe-interval-in-seconds 120 \
--sample-size 4 \
--successful-samples-required 3

# CREATE ORIGIN
echo "Creating Origin..."
az afd origin create \
--origin-name $ORIGIN_NAME \
--origin-group-name $ORIGIN_GROUP \
--profile-name $FRONTDOOR_NAME \
--resource-group $RESOURCE_GROUP \
--host-name $STORAGE_HOST \
--https-port 443

# CREATE ROUTE
echo "Creating Route..."
az afd route create \
--route-name route-static \
--endpoint-name $ENDPOINT_NAME \
--profile-name $FRONTDOOR_NAME \
--resource-group $RESOURCE_GROUP \
--origin-group $ORIGIN_GROUP \
--supported-protocols Http Https \
--patterns "/*" \
--forwarding-protocol HttpsOnly \
--link-to-default-domain Enabled

# GET FINAL URL
echo "Deployment complete."

ENDPOINT=$(az afd endpoint show \
--endpoint-name $ENDPOINT_NAME \
--profile-name $FRONTDOOR_NAME \
--resource-group $RESOURCE_GROUP \
--query hostName \
--output tsv)

echo "Your website is available at:"
echo "https://$ENDPOINT"