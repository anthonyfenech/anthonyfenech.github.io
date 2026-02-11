// Search results page functionality
import { OTR_DOCUMENTS } from './documents.js';

// Get query from URL
const params = new URLSearchParams(window.location.search);
const query = params.get('q') || '';

// Update search input with current query
document.getElementById('search-input').value = query;

// Filter documents
function searchDocuments(searchQuery) {
  if (!searchQuery) return OTR_DOCUMENTS;

  const q = searchQuery.toLowerCase();
  return OTR_DOCUMENTS.filter(doc => {
    const searchText = [
      doc.title,
      doc.from,
      doc.to,
      doc.type,
      doc.classification,
      doc.date,
      doc.participants.join(' '),
      doc.subjects.join(' '),
      doc.content.map(c => c.text).join(' ')
    ].join(' ').toLowerCase();

    return searchText.includes(q);
  });
}

const results = searchDocuments(query);

// Display count
const resultsCount = document.getElementById('results-count');
if (query) {
  resultsCount.textContent = `Showing ${results.length} of ${OTR_DOCUMENTS.length} documents for "${query}"`;
} else {
  resultsCount.textContent = `Showing all ${results.length} documents`;
}

// Display results
const resultsGrid = document.getElementById('results-grid');

if (results.length === 0) {
  resultsGrid.innerHTML = '<div class="no-results"><p>No documents found matching your search.</p></div>';
} else {
  results.forEach(doc => {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
      <div class="doc-classification">${doc.classification}</div>
      <div class="doc-id">${doc.id}</div>
      <h3 class="doc-title">${doc.title}</h3>
      <div class="doc-date">${doc.date}</div>
      <a href="document.html?id=${doc.id}" class="view-link">VIEW DOCUMENT &rarr;</a>
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
