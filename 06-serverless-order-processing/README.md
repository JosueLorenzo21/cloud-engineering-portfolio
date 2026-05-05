# 06 – Azure Serverless Order Processing System

This project demonstrates a **serverless, event-driven architecture** using Azure Functions and Azure Storage services.

The system receives orders via HTTP, queues them for processing, and stores the results asynchronously.

---

# Architecture

Client → HTTP Function → Queue Storage → Queue Function → Table Storage

---

# Azure Services Used

* Azure Functions (HTTP + Queue Trigger)
* Azure Queue Storage
* Azure Table Storage
* Application Insights
* GitHub Actions (CI/CD)

---

# Workflow

1. Client sends an order via HTTP request
2. The `submitOrder` function validates and sends it to a queue
3. The `processOrder` function is triggered automatically
4. The order is processed asynchronously
5. The result is stored in Azure Table Storage

---

# Example Request

```json
{
  "orderId": "ORD-2001",
  "customer": "Josue",
  "product": "Serverless Plan",
  "amount": 79.99
}
```

---

# Example Response

```json
{
  "message": "Order submitted successfully",
  "orderId": "ORD-2001",
  "status": "queued"
}
```

---

# Example Processed Record

```json
{
  "partitionKey": "orders",
  "rowKey": "ORD-2001",
  "customer": "Josue",
  "product": "Serverless Plan",
  "amount": 79.99,
  "status": "processed",
  "submittedAt": "...",
  "processedAt": "..."
}
```

---

# Key Concepts Demonstrated

* Serverless computing
* Event-driven architecture
* Asynchronous processing
* Queue-based decoupling
* Microservices design pattern
* Cloud-native application design

---

# CI/CD Pipeline

This project uses GitHub Actions to automatically deploy changes:

```text
git push → GitHub Actions → Azure Functions
```

---

# What I Learned

* How to build serverless APIs using Azure Functions
* How to decouple systems using Queue Storage
* How to process events asynchronously
* How to persist data in Table Storage
* How to implement CI/CD with GitHub Actions

---

# Future Improvements

* Add retry logic and dead-letter queue
* Integrate Logic Apps for notifications
* Add monitoring dashboards
* Use Azure Service Bus for advanced messaging
* Implement authentication and authorization

---

# Key Insight

Separating request handling from processing using queues improves scalability, reliability, and performance in cloud applications.
