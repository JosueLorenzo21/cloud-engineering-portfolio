const { app } = require('@azure/functions');
const { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential } = require('@azure/storage-blob');

const accountName = "imageanalyzerstorage2026";
const containerName = "images";

app.http('generateUploadUrl', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {

        const body = await request.json();
        const fileName = body.fileName;

        const blobName = fileName;

        const credential = new StorageSharedKeyCredential(
            accountName,
            process.env.AZURE_STORAGE_KEY
        );

        const expiresOn = new Date();
        expiresOn.setMinutes(expiresOn.getMinutes() + 10);

        const sasToken = generateBlobSASQueryParameters({
            containerName,
            blobName,
            permissions: BlobSASPermissions.parse("cw"),
            expiresOn
        }, credential).toString();

        const uploadUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;

        return {
            jsonBody: {
                uploadUrl
            }
        };
    }
});
