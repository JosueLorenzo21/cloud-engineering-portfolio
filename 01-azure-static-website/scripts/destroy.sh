#!/bin/bash

RESOURCE_GROUP="rg-static-site-cli"

echo "Deleting resource group..."

az group delete \
--name $RESOURCE_GROUP \
--yes

echo "Resources deleted."
