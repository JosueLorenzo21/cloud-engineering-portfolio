\# 04 – Azure Logic App Alert Notification Workflow



This project demonstrates how to build an automated alert notification system using \*\*Azure Logic Apps (Consumption)\*\*.



The workflow receives an HTTP request, evaluates the severity of the alert, and sends an email notification if the severity is high.



\---



\# Architecture



External Request (curl / system) → Logic App (HTTP Trigger) → Parse JSON → Condition → Email Notification



\---



\# Azure Services Used



Azure Logic Apps (Consumption)

Office 365 / Outlook Connector



\---



\# Workflow Overview



1\. HTTP request is received

2\. JSON payload is parsed

3\. Condition checks if severity equals "high"

4\. If true → send email notification

5\. If false → no alert is sent



\---



\# Sample Request



Example JSON sent to the Logic App:



```json

{

&#x20; "system": "website",

&#x20; "severity": "high",

&#x20; "message": "Production site is down"

}

```



\---



\# Testing with curl



```bash

curl -X POST "<LOGIC\_APP\_URL>" \\

\-H "Content-Type: application/json" \\

\-d '{"system":"website","severity":"high","message":"Production site is down"}'

```



\---



\# Email Output Example



Subject:

High Severity Alert - website



Body:

🚨 High Severity Alert



System: website

Severity: high

Message: Production site is down



Time: (generated dynamically)



\---



\# What I Learned



How to design workflows using Azure Logic Apps

How to use HTTP triggers for automation

How to parse and process JSON inputs

How to implement conditional logic in workflows

How to integrate external services (email connectors)

How to monitor and debug workflows using Run History



\---



\# Troubleshooting Experience



During this project, I resolved issues such as:



Incorrect JSON formatting in HTTP requests

Misconfigured conditions (dynamic content vs literal values)

Debugging execution paths using run history



\---



\# Future Improvements



Add integration with Azure Monitor alerts

Store alerts in a database or storage account

Send notifications to multiple channels (Teams, SMS, etc.)

Add response output to behave like an API



\---



\# Key Concept



Azure Logic Apps enables low-code automation by orchestrating services through visual workflows instead of traditional backend code.



