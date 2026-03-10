const { app } = require('@azure/functions');
const {
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential
} = require('@azure/storage-blob');

const accountName = 'imageanalyzerstorage2026';
const containerName = 'images';

app.http('analyzeImage', {
  methods: ['POST'],
  authLevel: 'anonymous',

  handler: async (request, context) => {
    try {
      const body = await request.json();
      const fileName = body.fileName;

      if (!fileName) {
        return {
          status: 400,
          jsonBody: {
            error: 'fileName is required'
          }
        };
      }

      const storageKey = process.env.AZURE_STORAGE_KEY;
      const visionEndpoint = process.env.VISION_ENDPOINT;
      const visionKey = process.env.VISION_KEY;

      if (!storageKey || !visionEndpoint || !visionKey) {
        return {
          status: 500,
          jsonBody: {
            error: 'Missing required application settings'
          }
        };
      }

      const credential = new StorageSharedKeyCredential(accountName, storageKey);

      const expiresOn = new Date();
      expiresOn.setMinutes(expiresOn.getMinutes() + 10);

      const sasToken = generateBlobSASQueryParameters(
        {
          containerName,
          blobName: fileName,
          permissions: BlobSASPermissions.parse('r'),
          expiresOn
        },
        credential
      ).toString();

      const imageUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${fileName}?${sasToken}`;

      const endpoint = `${visionEndpoint.replace(/\/$/, '')}/computervision/imageanalysis:analyze?api-version=2024-02-01&features=caption,tags`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': visionKey
        },
        body: JSON.stringify({
          url: imageUrl
        })
      });

      const result = await response.json();

      if (!response.ok) {
        context.log('Vision API error:', result);
        return {
          status: response.status,
          jsonBody: {
            error: 'Vision API request failed',
            details: result
          }
        };
      }

      return {
        status: 200,
        jsonBody: {
          imageUrl,
          caption: result.captionResult?.text || null,
          confidence: result.captionResult?.confidence || null,
          tags: result.tagsResult?.values || []
        }
      };
    } catch (error) {
      context.log('analyzeImage error:', error);

      return {
        status: 500,
        jsonBody: {
          error: 'Internal server error',
          details: error.message
        }
      };
    }
  }
});
