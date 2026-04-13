import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';
import { alumniDocuments, staffRequestsSeed, trackerSteps } from './data';

const initialState = {
  role: 'alumni',
  currentScreen: 'login',
  selectedDocumentId: 'tor',
  appointmentDate: 'February 27, 2026',
  appointmentTime: '9:00 AM',
  alumniRequest: {
    reference: 'ALM-2026-0001',
    status: 'Processing',
    documentId: 'tor',
    price: 150,
  },
  staffFilter: 'all',
  staffRequests: staffRequestsSeed,
};

const state = new ReactiveVar(initialState);
let rootNode = null;

const screenTitles = {
  login: '',
  alumniDashboard: '',
  staffDashboard: '',
  alumniProfile: 'My Profile',
  staffProfile: 'My Profile',
  documentSelect: 'Select Document',
  schedule: 'Schedule Appointment',
  review: 'Review Request',
  tracker: 'Order Tracker',
  staffManagement: 'Staff Management',
};

const bottomNavByRole = {
  alumni: [
    { id: 'alumniProfile', label: 'My Profile', icon: 'profile' },
    { id: 'alumniDashboard', label: 'Home', icon: 'grid' },
    { id: 'tracker', label: 'Request', icon: 'request' },
  ],
  staff: [
    { id: 'staffProfile', label: 'My Profile', icon: 'profile' },
    { id: 'staffManagement', label: 'Home', icon: 'grid' },
    { id: 'staffDashboard', label: 'Requests', icon: 'request' },
  ],
};

const screenBackTarget = {
  alumniProfile: 'alumniDashboard',
  staffProfile: 'staffManagement',
  documentSelect: 'alumniProfile',
  schedule: 'documentSelect',
  review: 'schedule',
  tracker: 'review',
  staffManagement: 'staffDashboard',
};

export function mountApp(node) {
  rootNode = node;

  Tracker.autorun(() => {
    render();
  });

  document.addEventListener('click', handleClick);
}

function setState(updater) {
  const current = state.get();
  const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
  state.set(next);
}

function navigate(screen) {
  setState((current) => ({
    ...current,
    currentScreen: screen,
  }));
}

function handleClick(event) {
  const trigger = event.target.closest('[data-action]');
  if (!trigger) {
    return;
  }

  const action = trigger.dataset.action;
  const id = trigger.dataset.id;

  if (action === 'select-role') {
    setState((current) => ({ ...current, role: id }));
    return;
  }

  if (action === 'login') {
    const emailInput = document.querySelector('[data-field="loginEmail"]');
    const passwordInput = document.querySelector('[data-field="loginPassword"]');
    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';

    if (!email || !password) {
      return;
    }

    const current = state.get();
    navigate(current.role === 'staff' ? 'staffDashboard' : 'alumniDashboard');
    return;
  }

  if (action === 'navigate') {
    navigate(id);
    return;
  }

  if (action === 'back') {
    const current = state.get();
    navigate(screenBackTarget[current.currentScreen] || (current.role === 'staff' ? 'staffDashboard' : 'alumniDashboard'));
    return;
  }

  if (action === 'select-document') {
    setState((current) => ({ ...current, selectedDocumentId: id }));
    return;
  }

  if (action === 'set-date') {
    setState((current) => ({ ...current, appointmentDate: id }));
    return;
  }

  if (action === 'set-time') {
    setState((current) => ({ ...current, appointmentTime: id }));
    return;
  }

  if (action === 'submit-request') {
    setState((current) => {
      const selectedDocument = getSelectedDocument(current);
      return {
        ...current,
        currentScreen: 'tracker',
        alumniRequest: {
          ...current.alumniRequest,
          documentId: selectedDocument.id,
          price: selectedDocument.price || 150,
          status: 'Processing',
        },
      };
    });
    return;
  }

  if (action === 'set-staff-filter') {
    setState((current) => ({ ...current, staffFilter: id }));
    return;
  }

  if (action === 'staff-update-status') {
    const nextStatus = trigger.dataset.status;
    setState((current) => ({
      ...current,
      staffRequests: current.staffRequests.map((request) =>
        request.id === id ? { ...request, status: nextStatus } : request
      ),
      staffFilter: nextStatus === 'approved' ? 'approved' : nextStatus === 'ready' ? 'ready' : current.staffFilter,
    }));
  }
}

function render() {
  if (!rootNode) {
    return;
  }

  const current = state.get();
  rootNode.innerHTML = `
    <main class="app-shell">
      <section class="phone-frame">
        ${renderTopBar(current)}
        <div class="screen-body ${current.currentScreen === 'login' ? 'screen-login' : ''}">
          ${renderScreen(current)}
        </div>
        ${renderBottomNav(current)}
      </section>
    </main>
  `;
}

function renderTopBar(current) {
  if (
    current.currentScreen === 'login' ||
    current.currentScreen === 'alumniDashboard' ||
    current.currentScreen === 'staffDashboard' ||
    current.currentScreen === 'tracker'
  ) {
    return '';
  }

  const title = screenTitles[current.currentScreen];
  const withBack = current.currentScreen !== 'alumniDashboard' && current.currentScreen !== 'staffDashboard';

  return `
    <header class="top-bar ${current.currentScreen.includes('Dashboard') ? 'top-bar-dashboard' : ''}">
      <div class="top-bar-line">
        ${withBack ? '<button class="icon-button back-button" data-action="back">&larr;</button>' : '<span class="top-bar-spacer"></span>'}
        <div class="top-bar-title-wrap">
          <h1 class="top-bar-title">${title}</h1>
          ${current.currentScreen === 'staffManagement' ? '<p class="top-bar-subtitle">Manage Document Requests</p>' : ''}
        </div>
        ${current.currentScreen.includes('Dashboard') ? '<div class="top-avatar-small"></div>' : '<span class="top-bar-spacer"></span>'}
      </div>
    </header>
  `;
}

function renderBottomNav(current) {
  if (current.currentScreen === 'login') {
    return '';
  }

  const items = bottomNavByRole[current.role];
  return `
    <nav class="bottom-nav">
      ${items
        .map((item) => {
          const active = current.currentScreen === item.id || (item.id === 'staffManagement' && current.currentScreen === 'staffDashboard');
          return `
            <button class="bottom-nav-item ${active ? 'is-active' : ''}" data-action="navigate" data-id="${item.id}">
              <span class="bottom-nav-icon">${renderNavIcon(item.icon)}</span>
              <span class="bottom-nav-label">${item.label}</span>
            </button>
          `;
        })
        .join('')}
    </nav>
  `;
}

function renderScreen(current) {
  switch (current.currentScreen) {
    case 'login':
      return renderLogin(current);
    case 'alumniDashboard':
      return renderAlumniDashboard();
    case 'staffDashboard':
      return renderStaffDashboard(current);
    case 'alumniProfile':
      return renderAlumniProfile();
    case 'staffProfile':
      return renderStaffProfile();
    case 'documentSelect':
      return renderDocumentSelect(current);
    case 'schedule':
      return renderSchedule(current);
    case 'review':
      return renderReview(current);
    case 'tracker':
      return renderTracker(current);
    case 'staffManagement':
      return renderStaffManagement(current);
    default:
      return '';
  }
}

function renderLogin(current) {
  return `
    <section class="portal-header">
      <img src="/logo.png" alt="University Logo" class="portal-logo" />
      <h1>University Portal</h1>
      <p>Document Request System</p> 
    </section>

    <section class="login-panel">
      <h2 class="login-role-title">${current.role === 'staff' ? 'STAFF' : 'ALUMNI'}</h2>
      <p class="login-label">Select Role</p>
      <div class="role-switch">
        <button class="role-card ${current.role === 'alumni' ? 'active' : ''}" data-action="select-role" data-id="alumni">
          <span class="role-icon">${iconProfile()}</span>
          <span>Alumni</span>
        </button>
        <button class="role-card ${current.role === 'staff' ? 'active' : ''}" data-action="select-role" data-id="staff">
          <span class="role-icon">${iconStaff()}</span>
          <span>Staff</span>
        </button>
      </div>

      <label class="field-label">Email</label>
      <input
        class="input-shell"
        type="email"
        placeholder="Enter your email"
        data-field="loginEmail"
      />

      <label class="field-label">Password</label>
      <input
        class="input-shell"
        type="password"
        placeholder="Enter your password"
        data-field="loginPassword"
      />

      <button class="primary-button" data-action="login">Login</button>
      <button class="text-link">Forgot Password ?</button>
      <p class="account-note">Don't have an account? <span>Create Account</span></p>
    </section>
  `;
}

function renderAlumniDashboard() {
  return `
    <section class="welcome-banner">
      <div>
        <h2>Welcome Back!</h2>
        <p>Bianca Traya</p>
      </div>
      <div class="hero-avatar">${iconProfile()}</div>
    </section>

    <section class="stats-grid">
      ${renderStatCard('0', 'Pending', 'gold')}
      ${renderStatCard('1', 'Approved', 'blue')}
      ${renderStatCard('1', 'Ready', 'green')}
    </section>

    <button class="primary-button section-button" data-action="navigate" data-id="documentSelect">${iconDocument()} Request Document</button>

    <button class="list-button" data-action="navigate" data-id="tracker">
      <span class="list-button-icon">${iconDocument()}</span>
      <span>My Requests</span>
      <span class="chevron">&rsaquo;</span>
    </button>

    <button class="list-button">
      <span class="list-button-icon">${iconCalendar()}</span>
      <span>Appointment Schedule</span>
    </button>

    <section class="note-card">
      <h3>How it works</h3>
      <ul>
        <li>Select your required document</li>
        <li>Schedule an appointment or record return</li>
        <li>Track your request status in real time</li>
        <li>Pick up when ready</li>
      </ul>
    </section>
  `;
}

function renderStaffDashboard(current) {
  const counts = getStaffCounts(current.staffRequests);
  return `
    <section class="welcome-banner">
      <div>
        <h2>Welcome Back!</h2>
        <p>Admin Staff</p>
      </div>
      <div class="hero-avatar">${iconProfile()}</div>
    </section>

    <section class="stats-grid">
      ${renderStatCard(String(counts.pending), 'Pending', 'gold')}
      ${renderStatCard(String(counts.approved), 'Approved', 'blue')}
      ${renderStatCard(String(counts.ready), 'Ready', 'green')}
    </section>

    <button class="primary-button section-button" data-action="navigate" data-id="staffManagement">${iconDocument()} Manage Requests</button>

    <div class="info-pill">1 pending request needs your attention</div>

    <section class="note-card staff-note">
      <h3>How it works</h3>
      <ul>
        <li>Review each requested document</li>
        <li>Schedule for approved return or record release</li>
        <li>Track your request status in real time</li>
        <li>Pick up when ready</li>
      </ul>
    </section>
  `;
}

function renderAlumniProfile() {
  return `
    <section class="profile-card profile-header-card">
      <div class="profile-avatar-large">${iconProfile()}</div>
      <h2>Bianca Traya</h2>
      <span class="profile-pill">Alumni</span>
    </section>

    <section class="detail-card">
      <h3>Account Information</h3>
      <div class="detail-row"><span>${iconEmail()}</span><div><strong>Email</strong><p>alumni@email.com</p></div></div>
      <div class="detail-row"><span>${iconId()}</span><div><strong>Student ID</strong><p>2021-123456</p></div></div>
      <div class="detail-row"><span>${iconGroup()}</span><div><strong>Account Type</strong><p>Alumni Account</p></div></div>
    </section>

    <section class="detail-card">
      <h3>Quick Information</h3>
      <button class="quick-link" data-action="navigate" data-id="documentSelect">
        <span>${iconDocument()}</span>
        <span>My Request</span>
        <span class="chevron">&rsaquo;</span>
      </button>
    </section>

    <button class="ghost-button logout-button">Logout</button>
  `;
}

function renderStaffProfile() {
  return `
    <section class="profile-card profile-header-card">
      <div class="profile-avatar-large">${iconProfile()}</div>
      <h2>Admin Staff</h2>
      <span class="profile-pill">Registrar Staff</span>
    </section>

    <section class="detail-card">
      <h3>Account Information</h3>
      <div class="detail-row"><span>${iconEmail()}</span><div><strong>Email</strong><p>asdmf@addu.edu.ph</p></div></div>
      <div class="detail-row"><span>${iconGroup()}</span><div><strong>Account Type</strong><p>Staff Account</p></div></div>
    </section>

    <button class="ghost-button logout-button">Logout</button>
  `;
}

function renderDocumentSelect(current) {
  return `
    <p class="section-copy">Choose the document you need to request</p>
    <section class="document-list">
      ${alumniDocuments.map((document) => renderDocumentCard(document, current.selectedDocumentId)).join('')}
    </section>
    <button class="primary-button sticky-button" data-action="navigate" data-id="schedule">Continue to appointment</button>
  `;
}

function renderSchedule(current) {
  const selectedDocument = getSelectedDocument(current);
  return `
    <section class="schedule-card slim-card">
      <div class="document-chip">
        <span class="list-button-icon">${iconDocument()}</span>
        <span>${selectedDocument.name}</span>
      </div>
    </section>

    <div class="picker-group">
      <label>Enter Date</label>
      <button class="picker-input" data-action="set-date" data-id="February 27, 2026">${current.appointmentDate}</button>
    </div>

    <div class="picker-group">
      <label>Enter Time</label>
      <button class="picker-input" data-action="set-time" data-id="9:00 AM">${current.appointmentTime}</button>
    </div>

    <section class="schedule-card">
      <p class="appointment-label">Appointment Schedule</p>
      <div class="appointment-badge">
        <span class="clock-dot">${iconClock()}</span>
        <span>${current.appointmentDate} - ${current.appointmentTime}</span>
      </div>
    </section>

    <button class="primary-button sticky-button" data-action="navigate" data-id="review">Continue to Summary</button>
  `;
}

function renderReview(current) {
  const selectedDocument = getSelectedDocument(current);
  const amount = selectedDocument.price || 150;
  return `
    <p class="section-copy">Please review your request details before submitting</p>

    <section class="detail-card">
      <h3>Document Details</h3>
      <div class="review-line"><span>${iconDocument()}</span><div><strong>Document Type</strong><p>${selectedDocument.name}</p></div></div>
      <div class="review-line"><span>${iconCalendar()}</span><div><strong>Appointment Date</strong><p>${current.appointmentDate}</p></div></div>
      <div class="review-line"><span>${iconClock()}</span><div><strong>Appointment Time</strong><p>${current.appointmentTime}</p></div></div>
    </section>

    <section class="detail-card">
      <h3>Payment Details</h3>
      <div class="amount-row"><span>Processing Fee</span><strong>P${amount}</strong></div>
      <div class="amount-row total"><span>Total Amount</span><strong>P${amount}</strong></div>
      <div class="review-line"><span>${iconWallet()}</span><div><strong>Payment Method</strong><p>Pay at Cashier</p></div></div>
    </section>

    <section class="important-card">
      <h3>Important Notes</h3>
      <ul>
        <li>Bring valid ID on your appointment</li>
        <li>Payment will be collected at the cashier</li>
        <li>Processing takes 3-5 business days</li>
        <li>Text message updates are included</li>
      </ul>
    </section>

    <button class="primary-button sticky-button" data-action="submit-request">Submit Request</button>
    <button class="secondary-link" data-action="navigate" data-id="schedule">Back to edit details</button>
  `;
}

function renderTracker(current) {
  const selectedDocument = getSelectedDocument(current);
  return `
    <section class="tracker-header">
      <h2>Track your document request</h2>
      <div class="tracker-summary">
        <div>
          <p class="tracker-status-label">Status</p>
          <strong>${current.alumniRequest.reference}</strong>
          <small>${selectedDocument.name}</small>
        </div>
        <div class="tracker-status-pill">Processing</div>
      </div>
    </section>

    <section class="timeline">
      ${trackerSteps.map((step, index) => renderTimelineStep(step, index === 1, index !== trackerSteps.length - 1)).join('')}
    </section>
  `;
}

function renderStaffManagement(current) {
  const counts = getStaffCounts(current.staffRequests);
  const filtered = filterStaffRequests(current.staffRequests, current.staffFilter);

  return `
    <div class="filter-copy">${iconFilter()} Filter by Status</div>
    <div class="filter-row">
      ${renderFilterChip('all', 'All', current.staffFilter)}
      ${renderFilterChip('pending', 'Pending', current.staffFilter)}
      ${renderFilterChip('approved', 'Approved', current.staffFilter)}
      ${renderFilterChip('rejected', 'Rejected', current.staffFilter)}
    </div>
    <div class="filter-row">
      ${renderFilterChip('ready', 'Ready to Pickup', current.staffFilter)}
    </div>

    <section class="stats-bar">
      ${renderMiniCount(String(current.staffRequests.length), 'Total')}
      ${renderMiniCount(String(counts.pending), 'Pending')}
      ${renderMiniCount(String(counts.approved), 'Approved')}
      ${renderMiniCount(String(counts.ready), 'Ready')}
    </section>

    <section class="staff-list">
      ${filtered.length ? filtered.map(renderStaffRequestCard).join('') : '<p class="empty-state">No requests found</p>'}
    </section>
  `;
}

function renderStatCard(value, label, theme) {
  return `
    <article class="stat-card">
      <div class="stat-icon ${theme}"></div>
      <strong>${value}</strong>
      <span>${label}</span>
    </article>
  `;
}

function renderDocumentCard(document, selectedId) {
  const selected = document.id === selectedId;
  const price = document.price ? `<strong>P${document.price}</strong>` : '';
  return `
    <button class="document-card ${selected ? 'is-selected' : ''}" data-action="select-document" data-id="${document.id}">
      <span class="document-icon">${iconDocument()}</span>
      <span class="document-copy">
        <strong>${document.name}</strong>
        <small>${document.subtitle}</small>
      </span>
      ${price}
    </button>
  `;
}

function renderTimelineStep(step, active, withLine) {
  return `
    <div class="timeline-step">
      <div class="timeline-marker ${active ? 'active' : ''}">
        <span>${active ? iconCheck() : ''}</span>
      </div>
      ${withLine ? '<div class="timeline-line"></div>' : ''}
      <div class="timeline-copy">
        <strong>${step.title}</strong>
        <p>${step.detail}</p>
      </div>
    </div>
  `;
}

function renderFilterChip(id, label, currentFilter) {
  return `
    <button class="filter-chip ${currentFilter === id ? 'is-active' : ''}" data-action="set-staff-filter" data-id="${id}">
      ${label}
    </button>
  `;
}

function renderMiniCount(value, label) {
  return `
    <div class="mini-count">
      <strong>${value}</strong>
      <span>${label}</span>
    </div>
  `;
}

function renderStaffRequestCard(request) {
  return `
    <article class="staff-request-card">
      <div class="staff-request-head">
        <div>
          <h3>${request.document}</h3>
          <p class="request-id">Ref: ${request.id}</p>
        </div>
        <span class="status-tag ${request.status}">${statusLabel(request.status)}</span>
      </div>
      <div class="request-meta">
        <span>${iconProfile()}</span>
        <span>${request.student}</span>
      </div>
      <div class="request-meta">
        <span>${iconCalendar()}</span>
        <span>${request.date}</span>
        <span>${iconClock()}</span>
        <span>${request.time}</span>
      </div>
      ${renderStaffActions(request)}
    </article>
  `;
}

function renderStaffActions(request) {
  if (request.status === 'pending') {
    return `
      <div class="staff-actions">
        <button class="approve-button" data-action="staff-update-status" data-id="${request.id}" data-status="approved">Approve</button>
        <button class="reject-button" data-action="staff-update-status" data-id="${request.id}" data-status="rejected">Reject</button>
      </div>
    `;
  }

  if (request.status === 'approved') {
    return `
      <button class="ready-button" data-action="staff-update-status" data-id="${request.id}" data-status="ready">
        Mark as Ready for Pickup
      </button>
    `;
  }

  if (request.status === 'ready') {
    return '<div class="ready-note">Ready for pickup - awaiting collection</div>';
  }

  return '';
}

function getSelectedDocument(current) {
  return alumniDocuments.find((document) => document.id === current.selectedDocumentId) || alumniDocuments[0];
}

function getStaffCounts(requests) {
  return requests.reduce(
    (counts, request) => {
      counts[request.status] += 1;
      return counts;
    },
    { pending: 0, approved: 0, ready: 0, rejected: 0 }
  );
}

function filterStaffRequests(requests, filter) {
  if (filter === 'all') {
    return requests;
  }

  return requests.filter((request) => request.status === filter);
}

function statusLabel(status) {
  return {
    pending: 'Pending',
    approved: 'Approved',
    ready: 'Ready to Pickup',
    rejected: 'Rejected',
  }[status];
}

function renderNavIcon(icon) {
  if (icon === 'profile') {
    return iconProfile();
  }
  if (icon === 'grid') {
    return iconGrid();
  }
  return iconDocument();
}

function iconProfile() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4"></circle>
      <path d="M5 19c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5"></path>
    </svg>
  `;
}

function iconStaff() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="8" cy="9" r="3"></circle>
      <circle cx="16" cy="9" r="3"></circle>
      <path d="M3.5 18c1.2-2.3 3-3.5 4.5-3.5"></path>
      <path d="M20.5 18c-1.2-2.3-3-3.5-4.5-3.5"></path>
      <path d="M8 18c1.2-2.5 3-4 4-4s2.8 1.5 4 4"></path>
    </svg>
  `;
}

function iconDocument() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3h7l4 4v14H7z"></path>
      <path d="M14 3v4h4"></path>
      <path d="M10 12h5"></path>
      <path d="M10 16h5"></path>
    </svg>
  `;
}

function iconGrid() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="6" height="6"></rect>
      <rect x="14" y="4" width="6" height="6"></rect>
      <rect x="4" y="14" width="6" height="6"></rect>
      <rect x="14" y="14" width="6" height="6"></rect>
    </svg>
  `;
}

function iconCalendar() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="6" width="16" height="14" rx="2"></rect>
      <path d="M8 3v5"></path>
      <path d="M16 3v5"></path>
      <path d="M4 10h16"></path>
    </svg>
  `;
}

function iconClock() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8"></circle>
      <path d="M12 8v5"></path>
      <path d="M12 13l3 2"></path>
    </svg>
  `;
}

function iconEmail() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="6" width="16" height="12" rx="2"></rect>
      <path d="M5 8l7 5 7-5"></path>
    </svg>
  `;
}

function iconId() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="2"></rect>
      <circle cx="9" cy="11" r="2"></circle>
      <path d="M13 10h4"></path>
      <path d="M13 14h4"></path>
    </svg>
  `;
}

function iconGroup() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="9" r="2.5"></circle>
      <circle cx="15.5" cy="10" r="2"></circle>
      <path d="M5.5 17c1.3-2.6 3-4 5-4"></path>
      <path d="M13 17c.7-1.7 1.8-2.8 3.7-3.2"></path>
    </svg>
  `;
}

function iconWallet() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 7h13a2 2 0 0 1 2 2v8H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"></path>
      <path d="M16 12h4"></path>
      <circle cx="16" cy="12" r="1"></circle>
    </svg>
  `;
}

function iconCheck() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 12l4 4 8-8"></path>
    </svg>
  `;
}

function iconFilter() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h16"></path>
      <path d="M7 12h10"></path>
      <path d="M10 18h4"></path>
    </svg>
  `;
}
