// Homepage functionality
import { OTR_DOCUMENTS } from './documents.js';

// Update document count
document.getElementById('doc-count').textContent = OTR_DOCUMENTS.length;

// Handle search form
document.getElementById('search-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const query = document.getElementById('search-input').value.trim();
  if (query) {
    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
  }
});

// Filter chips functionality
let activeFilter = '';
const filterChips = document.querySelectorAll('.filter-chip');

filterChips.forEach(chip => {
  chip.addEventListener('click', () => {
    // Update active state
    filterChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    // Update filter
    activeFilter = chip.dataset.type;
    displayFeaturedDocuments();
  });
});

// Display featured documents
function displayFeaturedDocuments() {
  const featuredGrid = document.getElementById('featured-grid');
  featuredGrid.innerHTML = '';

  // Filter by type if active
  let docs = OTR_DOCUMENTS;
  if (activeFilter) {
    docs = docs.filter(d => d.type === activeFilter);
  }

  // Sort by priority and take top 3
  const featured = docs
    .sort((a, b) => b.priority_score - a.priority_score)
    .slice(0, 3);

  if (featured.length === 0) {
    featuredGrid.innerHTML = '<p style="color: var(--color-text-secondary);">No documents found for this filter.</p>';
    return;
  }

  featured.forEach(doc => {
    const card = document.createElement('div');
    card.className = 'document-card';
    card.innerHTML = `
      <div class="doc-classification">${doc.classification}</div>
      <div class="doc-id">${doc.id}</div>
      <h3 class="doc-title">${doc.title}</h3>
      <div class="doc-date">${doc.date}</div>
      <a href="document.html?id=${doc.id}" class="view-link">VIEW DOCUMENT &rarr;</a>
    `;
    featuredGrid.appendChild(card);
  });
}

// Initial display
displayFeaturedDocuments();
