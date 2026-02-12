// Search results page functionality with access tier support
import { OTR_DOCUMENTS, STATS } from './document-adapter.js';

// Get query from URL
const params = new URLSearchParams(window.location.search);
const query = params.get('q') || '';

// Update search input with current query
document.getElementById('search-input').value = query;

// Filter documents
function searchDocuments(searchQuery) {
  if (!searchQuery) return OTR_DOCUMENTS.slice(0, 100); // Limit initial display

  const q = searchQuery.toLowerCase();
  return OTR_DOCUMENTS.filter(doc => {
    const searchText = [
      doc.title || '',
      doc.from || '',
      doc.to || '',
      doc.type || '',
      doc.date || '',
      doc.snippet || ''
    ].join(' ').toLowerCase();

    return searchText.includes(q);
  });
}

const results = searchDocuments(query);

// Display count
const resultsCount = document.getElementById('results-count');
if (query) {
  resultsCount.textContent = `Showing ${results.length.toLocaleString()} of ${OTR_DOCUMENTS.length.toLocaleString()} documents for "${query}"`;
} else {
  resultsCount.textContent = `Browse documents (showing first 100 of ${OTR_DOCUMENTS.length.toLocaleString()})`;
}

// Get badge HTML based on access tier
function getAccessBadge(access) {
  switch (access) {
    case 'open':
      return '<span class="access-badge open-badge">RELEASED</span>';
    case 'restricted':
      return '<span class="access-badge restricted-badge">&#128274; RESTRICTED</span>';
    case 'classified':
      return '<span class="access-badge classified-badge">CLASSIFIED</span>';
    default:
      return '<span class="access-badge">UNKNOWN</span>';
  }
}

// Get card class based on access tier
function getCardClass(access) {
  switch (access) {
    case 'open':
      return 'result-card open-card';
    case 'restricted':
      return 'result-card restricted-card';
    case 'classified':
      return 'result-card classified-card';
    default:
      return 'result-card';
  }
}

// Display results
const resultsGrid = document.getElementById('results-grid');

if (results.length === 0) {
  resultsGrid.innerHTML = '<div class="no-results"><p>No documents found matching your search.</p></div>';
} else {
  results.forEach(doc => {
    const card = document.createElement('div');
    card.className = getCardClass(doc.access);

    // For classified docs, redact title and snippet
    let displayTitle = doc.title;
    let displaySnippet = doc.snippet || '';

    if (doc.access === 'classified') {
      displayTitle = '████████████████████████';
      displaySnippet = '██████████████████████████████████████';
    }

    const viewLink = doc.access === 'classified'
      ? `<span class="view-link disabled">CLASSIFIED</span>`
      : `<a href="document.html?id=${doc.id}" class="view-link">VIEW DOCUMENT &rarr;</a>`;

    card.innerHTML = `
      ${getAccessBadge(doc.access)}
      <div class="doc-id">${doc.id}</div>
      <h3 class="doc-title">${displayTitle}</h3>
      <div class="doc-date">${doc.date}</div>
      <div class="doc-from">From: ${doc.from}</div>
      ${displaySnippet ? `<div class="doc-snippet">${displaySnippet}</div>` : ''}
      ${viewLink}
    `;

    resultsGrid.appendChild(card);
  });
}

// Handle new search
document.getElementById('search-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const newQuery = document.getElementById('search-input').value.trim();
  if (newQuery) {
    window.location.href = `search.html?q=${encodeURIComponent(newQuery)}`;
  } else {
    window.location.href = 'search.html';
  }
});
