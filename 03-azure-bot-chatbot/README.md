03 – Azure Support FAQ Chatbot



This project demonstrates how to build and deploy a simple FAQ chatbot using Azure Bot Service, Azure App Service, and Node.js.



The bot responds to common support questions such as services, pricing, support hours, and contact information.



Architecture



User → Azure Web Chat → Azure Bot → App Service (Node.js bot) → Response



Azure Bot acts as the messaging gateway, while the bot logic runs in a Node.js application hosted on Azure App Service.



Azure Services Used



Azure Bot Service

Azure App Service

Microsoft Entra ID (App Registration)

Web Chat channel



Features



The bot can respond to:



hello / hi → greeting

services → information about available services

pricing → pricing model explanation

support → support options

hours → support hours

contact → contact information

unknown message → fallback response



Project Structure



src/index.js

Main server that handles the /api/messages endpoint.



src/bots/faqBot.js

Contains the FAQ logic and responses.



Deployment



The bot is deployed to Azure App Service using Azure CLI.



Example command used:



az webapp deploy \\

&#x20; --resource-group rg-bot \\

&#x20; --name cloudsupportbotapp2026jlo \\

&#x20; --src-path deploy.zip \\

&#x20; --type zip

Environment Variables



The following environment variables are required in Azure App Service:



MicrosoftAppId

MicrosoftAppPassword

MicrosoftAppTenantId

MicrosoftAppType



MicrosoftAppType should be set to:



SingleTenant

Testing



The bot can be tested through:



Azure Portal → Azure Bot → Test in Web Chat



What I Learned



How Azure Bot routes messages to a backend service.

How to deploy Node.js applications to Azure App Service.

How bot authentication works using Microsoft Entra ID.

How to troubleshoot bot deployments and message routing issues.



Future Improvements



Integrate Azure OpenAI for smarter responses

Add conversation context and state management

Deploy a custom web chat interface

