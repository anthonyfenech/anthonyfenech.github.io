// Document viewer functionality
import { OTR_DOCUMENTS } from './documents.js';

// Get document ID from URL
const params = new URLSearchParams(window.location.search);
const docId = params.get('id');

// Find document
const doc = OTR_DOCUMENTS.find(d => d.id === docId);

const viewer = document.getElementById('document-viewer');

if (!doc) {
  viewer.innerHTML = `
    <div class="not-found">
      <p>Document not found</p>
      <p style="margin-top: var(--space-4);">
        <a href="index.html" style="color: var(--color-link);">Return to search</a>
      </p>
    </div>
  `;
} else {
  // Update page title
  document.title = `${doc.title} - The OTR Files`;

  // Display document
  const html = `
    <div class="document-header">
      <div class="doc-classification">${doc.classification}</div>
      <div class="doc-id">${doc.id}</div>
    </div>

    <h1 class="document-title">${doc.title}</h1>

    <div class="document-meta">
      <div><strong>Date:</strong> ${doc.date}</div>
      <div><strong>From:</strong> ${doc.from}</div>
      <div><strong>To:</strong> ${doc.to}</div>
      <div><strong>Type:</strong> ${doc.type.toUpperCase()}</div>
      <div><strong>Subjects:</strong> ${doc.subjects.join(', ')}</div>
    </div>

    <div class="document-content">
      ${doc.content.map(msg => `
        <div class="message">
          <div class="message-from">${msg.from}</div>
          <div class="message-time">${msg.time}</div>
          <div class="message-text">${msg.text}</div>
        </div>
      `).join('')}
    </div>
  `;

  viewer.innerHTML = html;
}

// Back button
document.getElementById('back-button').addEventListener('click', () => {
  // Try to go back, or go to index if no history
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = 'index.html';
  }
});
