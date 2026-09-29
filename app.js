const D = window.TECHOPS_DATA;
const content = document.getElementById('content');
const pageTitle = document.getElementById('pageTitle');
const modalRoot = document.getElementById('modalRoot');

const titles = {
  overview: 'Operations Overview',
  incidents: 'Incident Management',
  webhooks: 'Webhook Monitoring',
  services: 'Service Health',
  runbooks: 'Operational Runbooks',
  audit: 'Audit Log'
};

function statusPill(label) {
  const cls = label.toLowerCase().replace(/\s+/g, '-');
  return `<span class="status-pill ${cls}">${label}</span>`;
}
function sevPill(label) { return `<span class="severity ${label.toLowerCase()}">${label}</span>`; }
function statCard(label, value, note, accent='') {
  return `<div class="stat-card ${accent}"><div class="stat-label">${label}</div><div class="stat-value">${value}</div><div class="stat-note">${note}</div></div>`;
}
function sectionHeader(title, note, action='') {
  return `<div class="section-header"><div><h2>${title}</h2><div class="section-note">${note}</div></div>${action}</div>`;
}
function emptyState(text) { return `<div class="empty-state">${text}</div>`; }

function overviewView() {
  const healthy = D.services.filter(s => s.status === 'Healthy').length;
  return `
    <div class="grid four">${
      statCard('Service availability', D.kpis.serviceAvailability, `${healthy}/${D.services.length} core services healthy`, 'good') +
      statCard('Open incidents', D.kpis.openIncidents, '1 P1 • 2 P2', 'danger') +
      statCard('Webhook backlog', D.kpis.webhookBacklog, '7 currently retrying/failed', 'warning') +
      statCard('SLA breaches', D.kpis.slaBreaches, 'Requires operations review', 'danger')
    }</div>

    <div class="grid two top-gap">
      <section class="panel">${sectionHeader('Service health', 'Current synthetic telemetry across monitored services', '<button class="text-btn" data-nav="services">View all →</button>')}
        <div class="service-list">
          ${D.services.slice(0,5).map(s => `<div class="service-row"><div class="service-main"><div class="service-name">${s.name}</div><div class="service-meta">${s.tier} • ${s.owner}</div></div><div class="service-metric">${s.latency}</div>${statusPill(s.status)}</div>`).join('')}
        </div>
      </section>

      <section class="panel">${sectionHeader('Incident queue', 'Prioritized by severity and SLA exposure', '<button class="text-btn" data-nav="incidents">View queue →</button>')}
        <div class="incident-list">
          ${D.incidents.filter(i => i.status !== 'Resolved').map(i => `<button class="incident-row" data-incident="${i.id}"><div class="incident-left">${sevPill(i.severity)}<div><div class="incident-title">${i.title}</div><div class="incident-meta">${i.id} • ${i.service} • ${i.age}</div></div></div><div>${statusPill(i.sla)}</div></button>`).join('')}
        </div>
      </section>
    </div>

    <div class="grid two top-gap">
      <section class="panel">${sectionHeader('Recent operational alerts', 'Latest system events requiring awareness')}
        <div class="alert-list">${D.alerts.map(a => `<div class="alert-row"><div class="alert-time">${a.time}</div><div class="alert-text">${a.text}</div>${sevPill(a.severity)}</div>`).join('')}</div>
      </section>
      <section class="panel">${sectionHeader('Operations posture', 'What the on-call team should know right now')}
        <div class="posture">
          <div class="posture-card"><span class="posture-label">Payments</span><strong>Healthy</strong><span>Ledger and payment API within normal latency.</span></div>
          <div class="posture-card"><span class="posture-label">Webhooks</span><strong>Attention</strong><span>Delivery latency and retry backlog elevated.</span></div>
          <div class="posture-card"><span class="posture-label">Reconciliation</span><strong>Monitor</strong><span>Settlement ingestion completed manually; retry running.</span></div>
        </div>
      </section>
    </div>
  `;
}

function incidentsView() {
  return `
    <section class="panel">${sectionHeader('Incident queue', 'Track severity, ownership, service impact and SLA exposure')}
      <div class="toolbar"><input id="incidentSearch" class="search" placeholder="Search incidents, services or titles..." /></div>
      <div class="table-wrap"><table><thead><tr><th>Severity</th><th>Incident</th><th>Service</th><th>Status</th><th>Owner</th><th>Age</th><th>SLA</th></tr></thead><tbody id="incidentRows">
      ${D.incidents.map(i => `<tr class="clickable" data-incident="${i.id}"><td>${sevPill(i.severity)}</td><td><strong>${i.id}</strong><div class="table-sub">${i.title}</div></td><td>${i.service}</td><td>${statusPill(i.status)}</td><td>${i.owner}</td><td>${i.age}</td><td>${statusPill(i.sla)}</td></tr>`).join('')}
      </tbody></table></div>
    </section>`;
}

function webhooksView() {
  const failed = D.webhooks.filter(w => w.state === 'Failed').length;
  const retrying = D.webhooks.filter(w => w.state === 'Retrying').length;
  return `
    <div class="grid three">${statCard('Observed events', '7', 'Latest 5 minutes', 'good')}${statCard('Retrying', retrying, 'Backlog requires monitoring', 'warning')}${statCard('Failed', failed, 'Needs investigation', 'danger')}</div>
    <section class="panel top-gap">${sectionHeader('Webhook delivery stream', 'Synthetic delivery telemetry with retry and latency controls')}
      <div class="table-wrap"><table><thead><tr><th>Event ID</th><th>Event</th><th>Source</th><th>Received</th><th>Attempts</th><th>Latency</th><th>State</th></tr></thead><tbody>
      ${D.webhooks.map(w => `<tr><td><code>${w.id}</code></td><td>${w.event}</td><td>${w.source}</td><td>${w.received}</td><td>${w.attempts}</td><td>${w.latency}</td><td>${statusPill(w.state)}</td></tr>`).join('')}
      </tbody></table></div>
    </section>`;
}

function servicesView() {
  return `
    <section class="panel">${sectionHeader('Monitored services', 'Service catalog for operational ownership and runtime health')}
      <div class="service-grid">${D.services.map(s => `<article class="service-card"><div class="service-card-top"><div><span class="tier">${s.tier}</span><h3>${s.name}</h3></div>${statusPill(s.status)}</div><div class="service-detail"><div><span>Uptime</span><strong>${s.uptime}</strong></div><div><span>Latency</span><strong>${s.latency}</strong></div></div><div class="owner">Owner <strong>${s.owner}</strong></div></article>`).join('')}</div>
    </section>`;
}

function runbooksView() {
  return `
    <section class="panel">${sectionHeader('Operational runbooks', 'Standardized response procedures for repeatable incident handling')}
      <div class="runbook-grid">${D.runbooks.map((r, idx) => `<article class="runbook-card"><div class="runbook-index">0${idx+1}</div><div><div class="runbook-title">${r.name}</div><div class="runbook-meta">${r.scope} • ${r.steps} steps</div><div class="runbook-owner">Owner: ${r.owner}</div><div class="runbook-update">Updated ${r.lastUpdated}</div></div><button class="ghost-btn" data-runbook="${idx}">Open</button></article>`).join('')}</div>
    </section>`;
}

function auditView() {
  return `
    <section class="panel">${sectionHeader('Audit log', 'Chronological record of operational actions and automated controls')}
      <div class="table-wrap"><table><thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Object</th><th>Result</th></tr></thead><tbody>
      ${D.audit.map(a => `<tr><td>${a.time}</td><td><strong>${a.actor}</strong></td><td>${a.action}</td><td>${a.object}</td><td>${statusPill(a.result)}</td></tr>`).join('')}
      </tbody></table></div>
    </section>`;
}

function render(view='overview') {
  pageTitle.textContent = titles[view];
  content.innerHTML = ({ overview: overviewView, incidents: incidentsView, webhooks: webhooksView, services: servicesView, runbooks: runbooksView, audit: auditView }[view])();
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.view === view));
  bindInteractions(view);
}

function openIncident(id) {
  const i = D.incidents.find(x => x.id === id);
  if (!i) return;
  modalRoot.innerHTML = `<div class="modal-backdrop" data-close-modal><div class="modal" role="dialog" aria-modal="true" aria-label="Incident details"><button class="modal-close" data-close-modal>×</button><div class="modal-eyebrow">${sevPill(i.severity)} ${i.id}</div><h2>${i.title}</h2><p class="modal-copy">${i.description}</p><div class="modal-grid"><div><span>Service</span><strong>${i.service}</strong></div><div><span>Status</span><strong>${i.status}</strong></div><div><span>Owner</span><strong>${i.owner}</strong></div><div><span>SLA</span><strong>${i.sla}</strong></div></div><div class="next-action"><span>Suggested next action</span><strong>Open the associated runbook, validate telemetry, record the mitigation step, then update incident status.</strong></div></div></div>`;
}

function openRunbook(idx) {
  const r = D.runbooks[idx];
  const steps = ['Confirm alert and impacted service','Check current queue depth and latency','Validate recent configuration changes','Review retries and failed events','Apply approved mitigation','Verify service recovery','Record action in audit trail','Close or escalate based on SLA'];
  modalRoot.innerHTML = `<div class="modal-backdrop" data-close-modal><div class="modal" role="dialog" aria-modal="true" aria-label="Runbook"><button class="modal-close" data-close-modal>×</button><div class="modal-eyebrow">RUNBOOK • ${r.scope}</div><h2>${r.name}</h2><p class="modal-copy">Owner: ${r.owner} • Last updated ${r.lastUpdated}</p><ol class="steps">${steps.slice(0, r.steps).map((s, idx) => `<li><span>${idx+1}</span>${s}</li>`).join('')}</ol></div></div>`;
}

function closeModal() { modalRoot.innerHTML=''; }
function bindInteractions(view) {
  document.querySelectorAll('.nav-item').forEach(el => el.addEventListener('click', () => render(el.dataset.view)));
  document.querySelectorAll('[data-nav]').forEach(el => el.addEventListener('click', () => render(el.dataset.nav)));
  document.querySelectorAll('[data-incident]').forEach(el => el.addEventListener('click', () => openIncident(el.dataset.incident)));
  document.querySelectorAll('[data-runbook]').forEach(el => el.addEventListener('click', () => openRunbook(Number(el.dataset.runbook))));
  document.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));

  const search = document.getElementById('incidentSearch');
  if (search) search.addEventListener('input', () => {
    const q = search.value.toLowerCase();
    document.querySelectorAll('#incidentRows tr').forEach(row => row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none');
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
  if (!e.metaKey && !e.ctrlKey && ['1','2','3','4','5','6'].includes(e.key)) render(['overview','incidents','webhooks','services','runbooks','audit'][Number(e.key)-1]);
});
document.getElementById('refreshBtn').addEventListener('click', () => {
  const btn = document.getElementById('refreshBtn');
  btn.classList.add('spin');
  setTimeout(() => btn.classList.remove('spin'), 600);
});
render();
