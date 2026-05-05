\# 05 – Azure + Power BI Cloud Monitoring Dashboard



This project demonstrates how to build a cloud monitoring dashboard using \*\*Azure Blob Storage\*\* and \*\*Power BI Desktop\*\*.



The dataset is stored in Azure and visualized in Power BI to generate insights about system alerts and incidents.



\---



\# Architecture



CSV Dataset → Azure Blob Storage → Power BI → Dashboard



\---



\# Azure Services Used



Azure Blob Storage

Power BI Desktop



\---



\# Dataset Overview



The dataset represents system alerts with the following fields:



\* AlertID

\* Date

\* System

\* Severity

\* Status

\* ResponseTimeMinutes

\* Region

\* Owner

\* Source



\---



\# Dashboard Features



\## KPIs



\* Total Alerts

\* High Severity Alerts

\* Open Alerts

\* Average Response Time

\* High Severity %



\---



\## Visualizations



\* Alerts over time (line chart)

\* Alerts by system (bar chart)

\* Severity distribution (pie chart)

\* Alerts by region (bar chart)

\* Detailed incident table



\---



\# Key DAX Measure



```DAX

High Severity % =

DIVIDE(

&#x20;   CALCULATE(COUNTROWS('alerts'), 'alerts'\[Severity] = "high"),

&#x20;   COUNTROWS('alerts'),

&#x20;   0

)

```



\---



\# What I Learned



How to connect Power BI to Azure Blob Storage

How to clean and transform data using Power Query

How to create visualizations in Power BI

How to build KPIs using DAX

How to analyze data and generate insights



\---



\# Insights Example



The dashboard allows identification of:



\* systems generating the most alerts

\* percentage of critical incidents

\* average response times

\* regional distribution of alerts



\---



\# Future Improvements



Connect to real-time data sources

Use Azure SQL or Data Lake instead of CSV

Publish dashboard to Power BI Service

Automate data refresh



\---



\# Key Concept



Power BI transforms raw data into meaningful insights through modeling, aggregation, and visualization.



