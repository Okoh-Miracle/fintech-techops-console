window.TECHOPS_DATA = {
  kpis: {
    serviceAvailability: '99.98%',
    openIncidents: 3,
    webhookBacklog: 27,
    slaBreaches: 2,
    avgResolve: '18m'
  },
  services: [
    { id: 'svc-payments', name: 'Payments API', tier: 'Tier 0', status: 'Healthy', uptime: '99.99%', latency: '182 ms', owner: 'Payments Platform' },
    { id: 'svc-webhooks', name: 'Webhook Gateway', tier: 'Tier 0', status: 'Degraded', uptime: '99.95%', latency: '421 ms', owner: 'Platform Engineering' },
    { id: 'svc-ledger', name: 'Internal Ledger', tier: 'Tier 0', status: 'Healthy', uptime: '99.999%', latency: '86 ms', owner: 'Core Systems' },
    { id: 'svc-reconcile', name: 'Reconciliation Engine', tier: 'Tier 1', status: 'Healthy', uptime: '99.97%', latency: '211 ms', owner: 'Finance Operations' },
    { id: 'svc-risk', name: 'Risk Rules Service', tier: 'Tier 1', status: 'Healthy', uptime: '99.96%', latency: '104 ms', owner: 'Risk Platform' },
    { id: 'svc-notify', name: 'Notification Service', tier: 'Tier 2', status: 'Healthy', uptime: '99.92%', latency: '267 ms', owner: 'Customer Experience' }
  ],
  incidents: [
    { id: 'INC-2408', severity: 'P1', title: 'Webhook delivery latency above threshold', status: 'Investigating', service: 'Webhook Gateway', opened: '09:14', owner: 'Ops On-Call', age: '22m', sla: 'At risk', description: 'Delivery latency has exceeded the operational threshold for a sustained window. Queue depth is increasing while payment processing remains healthy.' },
    { id: 'INC-2407', severity: 'P2', title: 'Duplicate webhook signatures detected', status: 'Mitigating', service: 'Webhook Gateway', opened: '08:47', owner: 'Platform Eng', age: '49m', sla: 'Within SLA', description: 'Synthetic test traffic triggered duplicate event signatures. Deduplication checks are active and no ledger duplication is present.' },
    { id: 'INC-2405', severity: 'P2', title: 'Settlement file ingestion delayed', status: 'Monitoring', service: 'Reconciliation Engine', opened: '07:58', owner: 'Finance Ops', age: '1h 38m', sla: 'Breached', description: 'The latest synthetic settlement file arrived outside the expected processing window. Manual validation completed; automated retry is running.' },
    { id: 'INC-2399', severity: 'P3', title: 'Elevated notification queue', status: 'Resolved', service: 'Notification Service', opened: 'Yesterday 16:10', owner: 'CX Platform', age: 'Resolved', sla: 'Within SLA', description: 'Notification queue returned to baseline after a retry policy adjustment.' }
  ],
  webhooks: [
    { id: 'wh_81F2', event: 'payment.succeeded', source: 'Payments API', received: '09:34:12', attempts: 1, latency: '180 ms', state: 'Delivered' },
    { id: 'wh_81F1', event: 'payment.failed', source: 'Payments API', received: '09:34:08', attempts: 3, latency: '1.8 s', state: 'Retrying' },
    { id: 'wh_81EF', event: 'refund.created', source: 'Refunds', received: '09:33:56', attempts: 4, latency: '3.2 s', state: 'Failed' },
    { id: 'wh_81EA', event: 'payout.processed', source: 'Payouts', received: '09:33:31', attempts: 1, latency: '220 ms', state: 'Delivered' },
    { id: 'wh_81E7', event: 'customer.updated', source: 'Accounts', received: '09:33:11', attempts: 2, latency: '790 ms', state: 'Delivered' },
    { id: 'wh_81E3', event: 'payment.succeeded', source: 'Payments API', received: '09:32:47', attempts: 5, latency: '4.6 s', state: 'Failed' },
    { id: 'wh_81DF', event: 'chargeback.opened', source: 'Disputes', received: '09:31:03', attempts: 1, latency: '201 ms', state: 'Delivered' }
  ],
  alerts: [
    { time: '09:36', text: 'Webhook queue depth crossed 25 events', severity: 'P1' },
    { time: '09:29', text: 'Refund webhook entered retry threshold', severity: 'P2' },
    { time: '09:12', text: 'Settlement ingestion missed target window', severity: 'P2' },
    { time: '08:55', text: 'Duplicate signature rule triggered', severity: 'P3' }
  ],
  runbooks: [
    { name: 'Webhook Delivery Degradation', owner: 'Platform Engineering', scope: 'Webhook Gateway', steps: 8, lastUpdated: '18 Sep 2026' },
    { name: 'Settlement Ingestion Delay', owner: 'Finance Operations', scope: 'Reconciliation Engine', steps: 6, lastUpdated: '12 Sep 2026' },
    { name: 'Duplicate Event Investigation', owner: 'Core Systems', scope: 'Payments + Webhooks', steps: 7, lastUpdated: '21 Sep 2026' },
    { name: 'P1 Payment API Incident', owner: 'Payments Platform', scope: 'Payments API', steps: 10, lastUpdated: '03 Sep 2026' }
  ],
  audit: [
    { time: '09:36:18', actor: 'Synthetic Monitor', action: 'Raised queue-depth alert', object: 'Webhook Gateway', result: 'Triggered' },
    { time: '09:34:27', actor: 'Ops On-Call', action: 'Acknowledged INC-2408', object: 'Webhook Gateway', result: 'Acknowledged' },
    { time: '09:33:42', actor: 'Retry Worker', action: 'Attempted webhook delivery', object: 'wh_81F1', result: 'Retry #3' },
    { time: '09:29:11', actor: 'Rule Engine', action: 'Flagged duplicate signature', object: 'INC-2407', result: 'Flagged' },
    { time: '09:13:05', actor: 'SLA Monitor', action: 'Escalated settlement delay', object: 'INC-2405', result: 'Escalated' },
    { time: '08:56:34', actor: 'Platform Eng', action: 'Enabled dedupe protection', object: 'Webhook Gateway', result: 'Applied' }
  ]
};
