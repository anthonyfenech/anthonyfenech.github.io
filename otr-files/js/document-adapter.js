// Document Adapter - converts compact array format to objects
import { OTR_DOCUMENTS as RAW_DATA } from './documents.js';

// Type and access mappings
const TYPE_MAP = { w: 'tweet', x: 'text', e: 'email', a: 'article' };
const ACCESS_MAP = { o: 'open', r: 'restricted', c: 'classified' };
const CLASS_MAP = {
  o: 'UNREDACTED',
  r: 'RESTRICTED',
  c: 'CLASSIFIED'
};

// Convert array to object
function parseDocument(arr) {
  const idSuffix = arr[0];
  const mmdd = arr[1];
  const typeAccess = arr[2];
  const title = arr[3];
  const from = arr[4];
  const snippet = arr[5] || '';

  const type = TYPE_MAP[typeAccess[0]] || 'text';
  const access = ACCESS_MAP[typeAccess[1]] || 'restricted';

  // Reconstruct year from ID suffix pattern
  // IDs are like "20-T123456" or "-T123456" (2020s)
  let year = 2020;
  if (idSuffix.startsWith('19-')) year = 2019;
  else if (idSuffix.startsWith('18-')) year = 2018;
  else if (idSuffix.startsWith('17-')) year = 2017;
  else if (idSuffix.startsWith('16-')) year = 2016;
  else if (idSuffix.startsWith('15-')) year = 2015;
  else if (idSuffix.startsWith('14-')) year = 2014;
  else if (idSuffix.startsWith('13-')) year = 2013;
  else if (idSuffix.startsWith('12-')) year = 2012;
  else if (idSuffix.startsWith('11-')) year = 2011;
  else if (idSuffix.startsWith('10-')) year = 2010;
  else if (idSuffix.startsWith('09-')) year = 2009;
  else if (idSuffix.startsWith('07-')) year = 2007;
  else if (idSuffix.startsWith('08-')) year = 2008;

  const fullId = `DOC-20${idSuffix}`;
  const date = `${year}-${mmdd}`;

  return {
    id: fullId,
    type,
    access,
    classification: CLASS_MAP[typeAccess[1]] || 'RESTRICTED',
    title,
    date,
    year,
    from,
    to: 'Anthony Fenech',
    snippet,
    subjects: [],
    participants: [from, 'Anthony Fenech'],
    content: [],
    priority_score: access === 'open' ? 5 : (access === 'restricted' ? 2 : 1)
  };
}

// Convert all documents
const OTR_DOCUMENTS = RAW_DATA.map(parseDocument);

// Stats
const STATS = {
  total: OTR_DOCUMENTS.length,
  open: OTR_DOCUMENTS.filter(d => d.access === 'open').length,
  restricted: OTR_DOCUMENTS.filter(d => d.access === 'restricted').length,
  classified: OTR_DOCUMENTS.filter(d => d.access === 'classified').length
};

// Fetch full document for open records
async function fetchFullDocument(docId) {
  try {
    const response = await fetch(`documents/${docId}.json`);
    if (!response.ok) throw new Error('Not found');
    return await response.json();
  } catch (e) {
    console.error('Failed to fetch document:', docId, e);
    return null;
  }
}

export { OTR_DOCUMENTS, STATS, fetchFullDocument };
