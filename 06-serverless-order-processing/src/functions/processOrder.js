const { app } = require('@azure/functions');
const { TableClient, AzureNamedKeyCredential } = require('@azure/data-tables');

const accountName = 'ordersstorage2026';
const tableName = 'ProcessedOrders';

function getStorageAccountKey(connectionString) {
  const parts = connectionString.split(';');

  for (const part of parts) {
    if (part.startsWith('AccountKey=')) {
      return part.replace('AccountKey=', '');
    }
  }

  throw new Error('Storage account key not found in connection string');
}

app.storageQueue('processOrder', {
  queueName: 'orders-queue',
  connection: 'AzureWebJobsStorage',
  handler: async (queueItem, context) => {
    try {
      context.log('Processing order:', queueItem);

      const order = typeof queueItem === 'string'
        ? JSON.parse(queueItem)
        : queueItem;

      const connectionString = process.env.AzureWebJobsStorage;
      const accountKey = getStorageAccountKey(connectionString);

      const credential = new AzureNamedKeyCredential(accountName, accountKey);

      const tableClient = new TableClient(
        `https://${accountName}.table.core.windows.net`,
        tableName,
        credential
      );

      await tableClient.createTable();

      const entity = {
        partitionKey: 'orders',
        rowKey: order.orderId,
        customer: order.customer,
        product: order.product,
        amount: Number(order.amount),
        status: 'processed',
        submittedAt: order.submittedAt,
        processedAt: new Date().toISOString()
      };

      await tableClient.upsertEntity(entity);

      context.log(`Order ${order.orderId} processed successfully`);
    } catch (error) {
      context.log('processOrder error:', error);
      throw error;
    }
  }
});
