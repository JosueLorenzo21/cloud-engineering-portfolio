const { app } = require('@azure/functions');
const { QueueClient } = require('@azure/storage-queue');

app.http('submitOrder', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    try {
      const body = await request.json();

      const { orderId, customer, product, amount } = body;

      if (!orderId || !customer || !product || !amount) {
        return {
          status: 400,
          jsonBody: {
            error: 'Missing required fields: orderId, customer, product, amount'
          }
        };
      }

      const connectionString = process.env.AzureWebJobsStorage;
      const queueName = 'orders-queue';

      const queueClient = new QueueClient(connectionString, queueName);
      await queueClient.createIfNotExists();

      const message = Buffer.from(JSON.stringify({
        orderId,
        customer,
        product,
        amount,
        submittedAt: new Date().toISOString()
      })).toString('base64');

      await queueClient.sendMessage(message);

      return {
        status: 202,
        jsonBody: {
          message: 'Order submitted successfully',
          orderId,
          status: 'queued'
        }
      };
    } catch (error) {
      context.log('submitOrder error:', error);

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
