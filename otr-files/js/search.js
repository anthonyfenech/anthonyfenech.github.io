/**
 * OTR Search Engine
 * ==================
 * High-performance search for 140K+ documents.
 *
 * Features:
 * - O(1) exact match lookup with prefix fallback
 * - LRU search result caching (10 entries)
 * - Intelligent snippet extraction with keyword clustering
 * - Incremental document loading via addDocuments()
 * - Async indexing for large datasets (>1000 docs)
 *
 * Public API:
 *   constructor(documents)
 *   search(query, filters = {})
 *   getSnippet(doc, query, maxLength = 200)
 *   getFilterOptions()
 *   addDocuments(newDocs)
 *   isReady()
 *   onReady(callback)
 */

class OTRSearch {
  constructor(documents = []) {
    this.documents = [...documents];
    this.index = new Map(); // word -> Set of document indices

    // Change 2: Search result caching
    this._cache = new Map();
    this._cacheLimit = 10;

    // Change 5: Async indexing state
    this._ready = true;
    this._readyCallbacks = [];

    // Build the index
    this.buildIndex();
  }

  // ═══════════════════════════════════════════════════════════════
  // INDEXING
  // ═══════════════════════════════════════════════════════════════

  /**
   * Build the inverted index from all documents.
   * Sync for <1000 docs, async chunked for larger sets.
   */
  buildIndex() {
    const startTime = performance.now();

    // Change 5: Async indexing for large datasets
    if (this.documents.length < 1000) {
      // Sync — existing behavior for small datasets
      this.documents.forEach((doc, idx) => this._indexDocument(doc, idx));
      this._ready = true;
      const elapsed = (performance.now() - startTime).toFixed(1);
      console.log(`OTR Search: indexed ${this.documents.length} documents in ${elapsed}ms`);
      this._readyCallbacks.forEach(cb => cb());
      this._readyCallbacks = [];
      return;
    }

    // Async — chunked processing to avoid UI blocking
    this._ready = false;
    let i = 0;
    const chunkSize = 500;

    const processChunk = () => {
      const end = Math.min(i + chunkSize, this.documents.length);
      for (; i < end; i++) {
        this._indexDocument(this.documents[i], i);
      }
      if (i < this.documents.length) {
        setTimeout(processChunk, 0);
      } else {
        this._ready = true;
        const elapsed = (performance.now() - startTime).toFixed(1);
        console.log(`OTR Search: indexed ${this.documents.length} documents in ${elapsed}ms`);
        this._readyCallbacks.forEach(cb => cb());
        this._readyCallbacks = [];
      }
    };
    processChunk();
  }

  /**
   * Index a single document (extracted for reuse by addDocuments).
   * Change 4: Supports incremental loading.
   */
  _indexDocument(doc, idx) {
    // Concatenate all searchable fields (same as original buildIndex)
    const searchText = [
      doc.searchText || '',
      doc.title || '',
      (doc.tags || []).join(' '),
      (doc.subjects || []).join(' '),
      (doc.participants || []).join(' '),
      doc.contextNote || '',
      doc.from || '',
      doc.to || '',
      doc.snippet || '',
      doc.id || ''
    ].join(' ');

    const words = this.tokenize(searchText);

    for (const word of words) {
      if (!this.index.has(word)) {
        this.index.set(word, new Set());
      }
      this.index.get(word).add(idx);
    }
  }

  /**
   * Tokenize text into searchable words.
   */
  tokenize(text) {
    if (!text) return [];
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length >= 2);
  }

  // ═══════════════════════════════════════════════════════════════
  // SEARCH
  // ═══════════════════════════════════════════════════════════════

  /**
   * Search documents by query with optional filters.
   * Change 1: O(1) exact match, prefix fallback.
   * Change 2: Results cached.
   */
  search(query, filters = {}) {
    if (!query || !query.trim()) {
      return this.applyFilters(this.documents, filters);
    }

    // Change 2: Check cache first
    const cacheKey = query.trim().toLowerCase() + '|' + JSON.stringify(filters);
    if (this._cache.has(cacheKey)) {
      return this._cache.get(cacheKey);
    }

    const queryWords = this.tokenize(query);
    if (queryWords.length === 0) {
      return this.applyFilters(this.documents, filters);
    }

    // Find documents matching ALL query words
    let matchingIndices = null;

    for (const word of queryWords) {
      const matches = new Set();

      // Change 1: Try exact match first — O(1) lookup
      const exactMatch = this.index.get(word);
      if (exactMatch && exactMatch.size > 0) {
        exactMatch.forEach(idx => matches.add(idx));
      } else {
        // Prefix fallback — only if exact match found nothing
        // Change 1: Removed substring matching (includes) — too noisy
        for (const [indexedWord, docSet] of this.index) {
          if (indexedWord.startsWith(word)) {
            docSet.forEach(idx => matches.add(idx));
          }
        }
      }

      // Intersect with previous results (AND logic)
      if (matchingIndices === null) {
        matchingIndices = matches;
      } else {
        matchingIndices = new Set([...matchingIndices].filter(idx => matches.has(idx)));
      }
    }

    // Convert indices to documents
    let results = matchingIndices
      ? [...matchingIndices].map(idx => this.documents[idx])
      : [];

    // Apply filters
    results = this.applyFilters(results, filters);

    // Score and sort
    results = results
      .map(doc => ({ doc, score: this.scoreDocument(doc, queryWords) }))
      .sort((a, b) => b.score - a.score)
      .map(item => item.doc);

    // Change 2: Cache the results (LRU eviction)
    if (this._cache.size >= this._cacheLimit) {
      const firstKey = this._cache.keys().next().value;
      this._cache.delete(firstKey);
    }
    this._cache.set(cacheKey, results);

    return results;
  }

  /**
   * Score a document based on query word matches.
   */
  scoreDocument(doc, queryWords) {
    let score = 0;
    const title = (doc.title || '').toLowerCase();
    const tags = (doc.tags || []).join(' ').toLowerCase();
    const subjects = (doc.subjects || []).join(' ').toLowerCase();
    const searchText = (doc.searchText || doc.snippet || '').toLowerCase();

    for (const word of queryWords) {
      // Title matches weighted highest
      if (title.includes(word)) score += 10;
      // Tags/subjects next
      if (tags.includes(word)) score += 5;
      if (subjects.includes(word)) score += 5;
      // Body content
      if (searchText.includes(word)) score += 1;
    }

    // Boost open/released documents slightly
    if (doc.access === 'open') score += 2;

    return score;
  }

  /**
   * Apply filters to a document array.
   */
  applyFilters(docs, filters) {
    if (!filters || Object.keys(filters).length === 0) {
      return docs;
    }

    return docs.filter(doc => {
      // Type filter
      if (filters.type && doc.type !== filters.type) {
        return false;
      }

      // Year filter
      if (filters.year && doc.year !== filters.year) {
        return false;
      }

      // Classification/access filter
      if (filters.classification && doc.classification !== filters.classification) {
        return false;
      }
      if (filters.access && doc.access !== filters.access) {
        return false;
      }

      // Subject filter
      if (filters.subject) {
        const subjects = doc.subjects || [];
        if (!subjects.includes(filters.subject)) {
          return false;
        }
      }

      // Date range filter
      if (filters.dateFrom && doc.date < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && doc.date > filters.dateTo) {
        return false;
      }

      return true;
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // SNIPPETS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Generate a highlighted snippet for a document.
   * Change 3: Finds best keyword cluster, word-boundary aligned.
   */
  getSnippet(doc, query, maxLength = 200) {
    const text = doc.searchText || doc.snippet || doc.title || '';
    if (!text) return '';

    const queryWords = this.tokenize(query);
    if (queryWords.length === 0) {
      return this._truncateToWordBoundary(text, 0, maxLength);
    }

    const textLower = text.toLowerCase();

    // Find ALL positions of all query words
    const positions = [];
    for (const word of queryWords) {
      let pos = 0;
      while ((pos = textLower.indexOf(word, pos)) !== -1) {
        positions.push({ pos, word, len: word.length });
        pos += 1;
      }
    }

    // Fallback: no keywords found
    if (positions.length === 0) {
      return this._truncateToWordBoundary(text, 0, maxLength);
    }

    // Score each position by how many other matches fall within maxLength chars
    let bestPos = positions[0];
    let bestScore = 0;

    for (const p of positions) {
      let score = 0;
      const windowStart = p.pos;
      const windowEnd = p.pos + maxLength;

      for (const other of positions) {
        if (other.pos >= windowStart && other.pos < windowEnd) {
          score++;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestPos = p;
      }
    }

    // Center the window on the best position
    let start = Math.max(0, bestPos.pos - Math.floor(maxLength / 4));
    let end = Math.min(text.length, start + maxLength);

    // Expand to word boundaries
    const snippet = this._expandToWordBoundaries(text, start, end);

    // Highlight all query words in the snippet
    return this._highlightWords(snippet, queryWords);
  }

  /**
   * Expand start/end to nearest word boundaries.
   */
  _expandToWordBoundaries(text, start, end) {
    // Move start back to nearest space or beginning
    while (start > 0 && text[start - 1] !== ' ' && text[start - 1] !== '\n') {
      start--;
    }

    // Move end forward to nearest space or end
    while (end < text.length && text[end] !== ' ' && text[end] !== '\n') {
      end++;
    }

    let snippet = text.slice(start, end).trim();

    // Add ellipsis if truncated
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';

    return snippet;
  }

  /**
   * Truncate text to word boundary.
   */
  _truncateToWordBoundary(text, start, maxLength) {
    if (text.length <= maxLength) return text;

    let end = start + maxLength;
    while (end < text.length && text[end] !== ' ' && text[end] !== '\n') {
      end++;
    }

    const snippet = text.slice(start, Math.min(end, text.length)).trim();
    return end < text.length ? snippet + '...' : snippet;
  }

  /**
   * Highlight words with <mark> tags.
   */
  _highlightWords(text, words) {
    let result = text;

    for (const word of words) {
      // Case-insensitive replacement with <mark> tags
      const regex = new RegExp(`(${this._escapeRegex(word)})`, 'gi');
      result = result.replace(regex, '<mark>$1</mark>');
    }

    return result;
  }

  /**
   * Escape special regex characters.
   */
  _escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // ═══════════════════════════════════════════════════════════════
  // FILTER OPTIONS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get available filter options from indexed documents.
   */
  getFilterOptions() {
    const types = new Set();
    const years = new Set();
    const classifications = new Set();
    const subjects = new Set();
    const access = new Set();

    for (const doc of this.documents) {
      if (doc.type) types.add(doc.type);
      if (doc.year) years.add(doc.year);
      if (doc.classification) classifications.add(doc.classification);
      if (doc.access) access.add(doc.access);
      if (doc.subjects) {
        for (const s of doc.subjects) {
          subjects.add(s);
        }
      }
    }

    return {
      types: [...types].sort(),
      years: [...years].sort((a, b) => b - a), // Descending
      classifications: [...classifications].sort(),
      subjects: [...subjects].sort(),
      access: [...access].sort()
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // INCREMENTAL LOADING (Change 4)
  // ═══════════════════════════════════════════════════════════════

  /**
   * Add new documents to the search index.
   * Indexes incrementally without rebuilding.
   */
  addDocuments(newDocs) {
    if (!newDocs || newDocs.length === 0) return;

    const startIdx = this.documents.length;
    this.documents.push(...newDocs);

    // Index only the new documents
    newDocs.forEach((doc, i) => {
      this._indexDocument(doc, startIdx + i);
    });

    // Invalidate search cache
    this._cache.clear();
  }

  // ═══════════════════════════════════════════════════════════════
  // ASYNC STATE (Change 5)
  // ═══════════════════════════════════════════════════════════════

  /**
   * Check if indexing is complete.
   */
  isReady() {
    return this._ready;
  }

  /**
   * Register callback for when indexing completes.
   * Fires immediately if already ready.
   */
  onReady(callback) {
    if (this._ready) {
      callback();
      return;
    }
    this._readyCallbacks.push(callback);
  }
}

export { OTRSearch };
