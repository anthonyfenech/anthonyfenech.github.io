// Browse page functionality
import { OTR_DOCUMENTS } from './documents.js';

// Display count
document.getElementById('browse-count').textContent =
  `${OTR_DOCUMENTS.length} documents in archive`;

// Sort by date (newest first)
const sortedDocs = [...OTR_DOCUMENTS].sort((a, b) =>
  new Date(b.date) - new Date(a.date)
);

// Display all documents
const browseGrid = document.getElementById('browse-grid');

sortedDocs.forEach(doc => {
  const card = document.createElement('div');
  card.className = 'result-card';
  card.innerHTML = `
    <div class="doc-classification">${doc.classification}</div>
    <div class="doc-id">${doc.id}</div>
    <h3 class="doc-title">${doc.title}</h3>
    <div class="doc-date">${doc.date}</div>
    <a href="document.html?id=${doc.id}" class="view-link">VIEW DOCUMENT &rarr;</a>
  `;
  browseGrid.appendChild(card);
});
