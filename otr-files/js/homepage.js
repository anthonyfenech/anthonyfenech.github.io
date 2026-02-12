// Homepage functionality with access tier stats
import { OTR_DOCUMENTS, STATS } from './document-adapter.js';

// Update document counts
document.getElementById('doc-count').textContent = STATS.total.toLocaleString();

// Update tier stats if elements exist
const releasedEl = document.getElementById('released-count');
const restrictedEl = document.getElementById('restricted-count');
const classifiedEl = document.getElementById('classified-count');

if (releasedEl) releasedEl.textContent = STATS.open.toLocaleString();
if (restrictedEl) restrictedEl.textContent = STATS.restricted.toLocaleString();
if (classifiedEl) classifiedEl.textContent = STATS.classified.toLocaleString();

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
    filterChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeFilter = chip.dataset.type;
    displayFeaturedDocuments();
  });
});

// Get badge HTML
function getAccessBadge(access) {
  switch (access) {
    case 'open':
      return '<span class="access-badge open-badge">RELEASED</span>';
    case 'restricted':
      return '<span class="access-badge restricted-badge">RESTRICTED</span>';
    case 'classified':
      return '<span class="access-badge classified-badge">CLASSIFIED</span>';
    default:
      return '';
  }
}

// Display featured documents (prioritize open ones)
function displayFeaturedDocuments() {
  const featuredGrid = document.getElementById('featured-grid');
  featuredGrid.innerHTML = '';

  // Filter by type if active
  let docs = OTR_DOCUMENTS;
  if (activeFilter) {
    docs = docs.filter(d => d.type === activeFilter);
  }

  // Prioritize open documents, then sort by priority
  const featured = docs
    .sort((a, b) => {
      // Open docs first
      if (a.access === 'open' && b.access !== 'open') return -1;
      if (b.access === 'open' && a.access !== 'open') return 1;
      // Then by priority score
      return (b.priority_score || 0) - (a.priority_score || 0);
    })
    .slice(0, 6);

  if (featured.length === 0) {
    featuredGrid.innerHTML = '<p style="color: var(--color-text-secondary);">No documents found for this filter.</p>';
    return;
  }

  featured.forEach(doc => {
    const card = document.createElement('div');
    card.className = `document-card ${doc.access}-card`;

    let displayTitle = doc.title;
    if (doc.access === 'classified') {
      displayTitle = '████████████████████';
    }

    const viewLink = doc.access === 'classified'
      ? '<span class="view-link disabled">CLASSIFIED</span>'
      : `<a href="document.html?id=${doc.id}" class="view-link">VIEW DOCUMENT &rarr;</a>`;

    card.innerHTML = `
      ${getAccessBadge(doc.access)}
      <div class="doc-id">${doc.id}</div>
      <h3 class="doc-title">${displayTitle}</h3>
      <div class="doc-date">${doc.date}</div>
      ${viewLink}
    `;
    featuredGrid.appendChild(card);
  });
}

// Initial display
displayFeaturedDocuments();
