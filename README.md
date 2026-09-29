# Fintech TechOps Console

A fintech technical-operations prototype for monitoring service health, payment infrastructure incidents, webhook delivery, SLA exposure, operational runbooks, and audit events.

> **Portfolio prototype:** the dashboard uses synthetic telemetry, incidents, events, and service records for demonstration purposes.

## Live Demo

**https://okoh-miracle.github.io/fintech-techops-command-center/**

## What the prototype demonstrates

- Tiered service monitoring across payments, ledger, webhooks, reconciliation, risk, and notifications
- Incident queue with severity, owner, status, age, and SLA exposure
- Webhook retry and delivery monitoring
- Operational runbooks for repeatable incident response
- Audit trail for human and automated operational actions
- Searchable incident queue and interactive incident/runbook detail views

## Run locally

No build step is required.

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
