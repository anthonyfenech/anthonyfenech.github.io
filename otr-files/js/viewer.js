// Document viewer functionality with access tier support
import { OTR_DOCUMENTS, fetchFullDocument } from './document-adapter.js';

// Get document ID from URL
const params = new URLSearchParams(window.location.search);
const docId = params.get('id');

// Find document in index
const doc = OTR_DOCUMENTS.find(d => d.id === docId);

const viewer = document.getElementById('document-viewer');

async function renderDocument() {
  if (!doc) {
    viewer.innerHTML = `
      <div class="not-found">
        <p>Document not found</p>
        <p style="margin-top: var(--space-4);">
          <a href="index.html" style="color: var(--color-link);">Return to search</a>
        </p>
      </div>
    `;
    return;
  }

  // Update page title
  document.title = `${doc.title} - The OTR Files`;

  // Handle different access tiers
  if (doc.access === 'classified') {
    renderClassified();
  } else if (doc.access === 'restricted') {
    renderRestricted();
  } else {
    // Open - fetch full document
    const fullDoc = await fetchFullDocument(doc.id);
    if (fullDoc) {
      renderOpen(fullDoc);
    } else {
      renderOpen(doc); // Fallback to index data
    }
  }
}

function renderClassified() {
  viewer.innerHTML = `
    <div class="document-header classified">
      <div class="doc-classification classified-badge">CLASSIFIED</div>
      <div class="doc-id">${doc.id}</div>
    </div>

    <div class="classified-notice">
      <div class="lock-icon">&#128274;</div>
      <h1>THIS DOCUMENT IS CLASSIFIED</h1>
      <p class="classified-date">${doc.date}</p>
    </div>

    <div class="redacted-content">
      <p class="redacted-line">████████████████████████████████████████</p>
      <p class="redacted-line">██████████████████████████████</p>
      <p class="redacted-line">████████████████████████████████████████████</p>
      <p class="redacted-line">███████████████████████████</p>
      <p class="redacted-line">████████████████████████████████████████</p>
      <p class="redacted-line">██████████████████████████████████████</p>
      <p class="redacted-line">█████████████████████████████████</p>
      <p class="redacted-line">████████████████████████████████████████████</p>
    </div>

    <div class="classification-footer">
      <p>This document has been classified and is not available for public release.</p>
    </div>
  `;
}

function renderRestricted() {
  viewer.innerHTML = `
    <div class="document-header restricted">
      <div class="doc-classification restricted-badge">RESTRICTED</div>
      <div class="doc-id">${doc.id}</div>
    </div>

    <h1 class="document-title">${doc.title}</h1>

    <div class="document-meta">
      <div><strong>Date:</strong> ${doc.date}</div>
      <div><strong>From:</strong> ${doc.from}</div>
      <div><strong>To:</strong> ${doc.to}</div>
      <div><strong>Type:</strong> ${doc.type.toUpperCase()}</div>
    </div>

    <div class="restricted-notice">
      <div class="lock-icon">&#128274;</div>
      <h2>DOCUMENT RESTRICTED</h2>
      <p>This document is currently restricted from public access.</p>
      <p class="declassify-note">This document may be declassified in a future release.</p>
    </div>

    <div class="redacted-preview">
      <p class="redacted-line">████████████ ${doc.from} ████████████</p>
      <p class="redacted-line">██████████████████████████████</p>
      <p class="redacted-line">████████████████████████████████</p>
    </div>
  `;
}

function renderOpen(fullDoc) {
  const content = fullDoc.content && fullDoc.content.length > 0
    ? fullDoc.content.map(msg => `
        <div class="message">
          <div class="message-from">${msg.from || ''}</div>
          <div class="message-time">${msg.time || ''}</div>
          <div class="message-text">${msg.text || ''}</div>
        </div>
      `).join('')
    : `<div class="message"><div class="message-text">${fullDoc.snippet || doc.snippet || 'Content available in full document.'}</div></div>`;

  viewer.innerHTML = `
    <div class="document-header open">
      <div class="doc-classification open-badge">RELEASED</div>
      <div class="doc-id">${fullDoc.id}</div>
    </div>

    <h1 class="document-title">${fullDoc.title}</h1>

    <div class="document-meta">
      <div><strong>Date:</strong> ${fullDoc.date}</div>
      <div><strong>From:</strong> ${fullDoc.from}</div>
      <div><strong>To:</strong> ${fullDoc.to || 'Anthony Fenech'}</div>
      <div><strong>Type:</strong> ${fullDoc.type.toUpperCase()}</div>
      ${fullDoc.subjects && fullDoc.subjects.length ? `<div><strong>Subjects:</strong> ${fullDoc.subjects.join(', ')}</div>` : ''}
    </div>

    <div class="document-content">
      ${content}
    </div>
  `;
}

// Initialize
renderDocument();

// Back button
document.getElementById('back-button')?.addEventListener('click', () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = 'index.html';
  }
});
