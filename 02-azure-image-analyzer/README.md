-Project overview



Azure Image Analyzer is a serverless application that allows users

to upload an image and receive an AI-generated description.



The application uses Azure Functions, Azure Blob Storage,

and Azure AI Vision.



-Architecture diagram



Browser

&nbsp;↓

Azure Function (generateUploadUrl)

&nbsp;↓

Azure Blob Storage

&nbsp;↓

Azure Function (analyzeImage)

&nbsp;↓

Azure AI Vision



\-Technologies used



Azure Functions



Azure Blob Storage



Azure AI Vision



Node.js



JavaScript



Static Web Frontend



\-Features



✔ Direct upload to Azure Blob Storage using SAS tokens

✔ AI-based image description using Azure AI Vision

✔ Serverless backend

✔ Static web frontend



-Example API responses



POST /api/analyzeImage



{

&nbsp; "caption": "a dock on a lake",

&nbsp; "confidence": 0.67,

&nbsp; "tags": \["water","dock","outdoor"]

}

