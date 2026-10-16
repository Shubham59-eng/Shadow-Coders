import type { Scheme, Language } from '../types';

/**
 * Normalizes text by trimming whitespace, collapsing multiple spaces,
 * lowercasing, and normalizing Unicode characters.
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    // Normalize diacritics and composite characters
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Common transliteration & synonym mappings across EN, MR, HI
 */
const SYNONYM_MAP: Record<string, string[]> = {
  // Farming / Agriculture
  'kisan': ['kisan', 'kissan', 'किसान', 'शेतकरी', 'farmer', 'krishi', 'कृषि', 'कृषी', 'pmkisan'],
  'farmer': ['kisan', 'kissan', 'किसान', 'शेतकरी', 'farmer', 'krishi', 'कृषि', 'कृषी'],
  'shetkari': ['kisan', 'किसान', 'शेतकरी', 'farmer', 'krishi', 'नमो शेतकरी'],
  'krishi': ['kisan', 'किसान', 'शेतकरी', 'farmer', 'krishi', 'कृषि', 'कृषी'],
  
  // Scholarships & Education
  'scholarship': ['scholarship', 'शिष्यवृत्ती', 'छात्रवृत्ति', 'shishyavrutti', 'chhatravritti', 'vidyarthi', 'student', 'विद्यार्थी', 'mahadbt', 'nsp', 'ebc', 'pragati'],
  'student': ['student', 'विद्यार्थी', 'छात्र', 'scholarship', 'शिष्यवृत्ती', 'shikshan', 'शिक्षण'],
  'shishyavrutti': ['scholarship', 'शिष्यवृत्ती', 'छात्रवृत्ति', 'ebc', 'mahadbt', 'shahu'],
  'chhatravritti': ['scholarship', 'शिष्यवृत्ती', 'छात्रवृत्ति', 'nsp'],
  'mahadbt': ['mahadbt', 'maha dbt', 'महाडीबीटी', 'ebc', 'shahu', 'rajarshi', 'hostel'],
  
  // Women
  'women': ['women', 'woman', 'महिला', 'स्त्री', 'stree', 'ladki bahin', 'ladli behna', 'nari', 'नारी'],
  'mahila': ['women', 'महिला', 'स्त्री', 'ladki bahin', 'ladli behna', 'nari', 'नारी'],
  'ladki': ['ladki bahin', 'majhi ladki', 'ladli behna', 'माझी लाडकी बहीण', 'लाडली बहना', 'ladki'],
  'ladli': ['ladki bahin', 'majhi ladki', 'ladli behna', 'माझी लाडकी बहीण', 'लाडली बहना'],
  'bahin': ['ladki bahin', 'majhi ladki', 'लाडकी बहीण'],
  
  // Healthcare
  'health': ['health', 'healthcare', 'आरोग्य', 'उपचार', 'ayushman', 'pmjay', 'mjpjay', 'card', 'कार्ड', 'hospital'],
  'ayushman': ['ayushman', 'ayushman bharat', 'आयुष्मान', 'pmjay', 'card', 'golden card'],
  'arogya': ['आरोग्य', 'health', 'ayushman', 'mjpjay', 'उपचार'],
  
  // Loans & Employment
  'loan': ['loan', 'कर्ज', 'ऋण', 'mudra', 'मुद्रा', 'svanidhi', 'pmegp', 'credit'],
  'mudra': ['mudra', 'मुद्रा', 'loan', 'कर्ज', 'tarun', 'kishor', 'shishu'],
  'vishwakarma': ['vishwakarma', 'विश्वकर्मा', 'artisan', 'craftsman', 'कारागीर', 'टूलकिट', 'toolkit'],
  'employment': ['employment', 'job', 'काम', 'रोजगार', 'training', 'internship', 'yuva karya', 'cmegp', 'pmegp'],
  'rojgar': ['employment', 'job', 'रोजगार', 'काम', 'cmegp', 'pmegp', 'yuva karya'],
  
  // Senior citizens
  'senior': ['senior', 'elder', 'ज्येष्ठ नागरिक', 'वृद्ध', 'pension', 'पेन्शन', 'nsap', 'वय', 'vaya vandana', 'vayoshri'],
  'pension': ['pension', 'पेन्शन', 'निवृत्तीवेतन', 'niradhar', 'sanjay gandhi', 'shravanbal', 'nsap'],
  
  // Housing
  'housing': ['housing', 'awas', 'आवास', 'घरकुल', 'home', 'pmay', 'makan'],
  'awas': ['housing', 'awas', 'आवास', 'घरकुल', 'pmay'],
  'gharkul': ['घरकुल', 'housing', 'awas', 'आवास', 'pmay']
};

export interface SearchMatchScore {
  scheme: Scheme;
  score: number;
  matchedFields: string[];
}

/**
 * Searches a list of schemes using multi-field tokenized matching,
 * linguistic synonym expansion, and relevance scoring.
 */
export function searchSchemes(
  schemes: Scheme[],
  rawQuery: string,
  options?: {
    category?: string;
    level?: string;
    minScoreThreshold?: number;
  }
): Scheme[] {
  const query = normalizeText(rawQuery);
  const selectedCategory = options?.category || 'all';
  const selectedLevel = options?.level || 'all';
  const minScoreThreshold = options?.minScoreThreshold || 10;

  // If no query and filters are 'all', return all schemes directly
  if (!query && selectedCategory === 'all' && selectedLevel === 'all') {
    return schemes;
  }

  // Tokenize user query
  const queryTokens = query ? query.split(' ').filter(Boolean) : [];

  // Expand tokens with synonyms
  const expandedTokens = new Set<string>();
  queryTokens.forEach(token => {
    expandedTokens.add(token);
    // Exact or prefix synonym match
    for (const [key, synonyms] of Object.entries(SYNONYM_MAP)) {
      if (token.includes(key) || key.includes(token)) {
        synonyms.forEach(s => expandedTokens.add(normalizeText(s)));
      }
    }
  });

  const expandedList = Array.from(expandedTokens);

  const scoredResults: SearchMatchScore[] = [];
  const seenIds = new Set<string>();

  for (const scheme of schemes) {
    if (seenIds.has(scheme.id)) continue;

    // 1. Category check
    if (selectedCategory !== 'all') {
      const schemeCat = scheme.category || 'all';
      if (schemeCat !== selectedCategory) {
        // Also support mapping e.g. 'students' vs 'scholarships'
        if (!(selectedCategory === 'students' && schemeCat === 'scholarships') &&
            !(selectedCategory === 'scholarships' && schemeCat === 'students')) {
          continue;
        }
      }
    }

    // 2. Level check
    if (selectedLevel !== 'all') {
      if (scheme.level !== selectedLevel) {
        continue;
      }
    }

    // If query is empty, add with baseline score
    if (!query) {
      scoredResults.push({ scheme, score: 50, matchedFields: ['filter'] });
      seenIds.add(scheme.id);
      continue;
    }

    // 3. Multi-field text collection
    const titleEn = normalizeText(scheme.title?.en || scheme.name?.en || '');
    const titleMr = normalizeText(scheme.title?.mr || scheme.name?.mr || '');
    const titleHi = normalizeText(scheme.title?.hi || scheme.name?.hi || '');
    const descEn = normalizeText(scheme.shortDescription?.en || '');
    const descMr = normalizeText(scheme.shortDescription?.mr || '');
    const descHi = normalizeText(scheme.shortDescription?.hi || '');
    const highlightEn = normalizeText(scheme.keyHighlight?.en || '');
    const highlightMr = normalizeText(scheme.keyHighlight?.mr || '');
    const highlightHi = normalizeText(scheme.keyHighlight?.hi || '');
    const authority = normalizeText(scheme.authority || scheme.issuingOrganization || scheme.department || '');
    const category = normalizeText(scheme.category || '');
    const tags = (scheme.tags || []).map(normalizeText);

    // Collect benefits text
    const benefitsText = [
      ...(scheme.benefits?.en || []),
      ...(scheme.benefits?.mr || []),
      ...(scheme.benefits?.hi || [])
    ].map(normalizeText).join(' ');

    // Collect eligibility text
    const eligibilityText = [
      ...(scheme.eligibility?.en || scheme.eligibilityCriteria?.en || []),
      ...(scheme.eligibility?.mr || scheme.eligibilityCriteria?.mr || []),
      ...(scheme.eligibility?.hi || scheme.eligibilityCriteria?.hi || [])
    ].map(normalizeText).join(' ');

    // Collect required documents text
    const docsText = [
      ...(scheme.requiredDocuments?.en || []),
      ...(scheme.requiredDocuments?.mr || []),
      ...(scheme.requiredDocuments?.hi || [])
    ].map(normalizeText).join(' ');

    let score = 0;
    const matchedFields: string[] = [];

    // Check exact full query matches first (Highest confidence)
    if (titleEn === query || titleMr === query || titleHi === query) {
      score += 120;
      matchedFields.push('title_exact');
    } else if (titleEn.startsWith(query) || titleMr.startsWith(query) || titleHi.startsWith(query)) {
      score += 90;
      matchedFields.push('title_prefix');
    } else if (titleEn.includes(query) || titleMr.includes(query) || titleHi.includes(query)) {
      score += 70;
      matchedFields.push('title_contains');
    }

    // Check query inside tags
    if (tags.some(t => t.includes(query) || query.includes(t))) {
      score += 50;
      matchedFields.push('tag_match');
    }

    // Check query inside category or authority
    if (category.includes(query) || query.includes(category)) {
      score += 45;
      matchedFields.push('category');
    }
    if (authority.includes(query)) {
      score += 35;
      matchedFields.push('authority');
    }

    // Check query in highlights or description
    if (highlightEn.includes(query) || highlightMr.includes(query) || highlightHi.includes(query)) {
      score += 30;
      matchedFields.push('highlight');
    }
    if (descEn.includes(query) || descMr.includes(query) || descHi.includes(query)) {
      score += 25;
      matchedFields.push('description');
    }

    // Check in benefits, eligibility, docs
    if (benefitsText.includes(query)) {
      score += 20;
      matchedFields.push('benefits');
    }
    if (eligibilityText.includes(query)) {
      score += 20;
      matchedFields.push('eligibility');
    }
    if (docsText.includes(query)) {
      score += 15;
      matchedFields.push('documents');
    }

    // Token & Synonym matching
    let tokenMatchesCount = 0;
    for (const token of expandedList) {
      if (token.length < 2) continue;
      let matched = false;

      if (titleEn.includes(token) || titleMr.includes(token) || titleHi.includes(token)) {
        score += 25;
        matched = true;
      }
      if (tags.some(t => t.includes(token))) {
        score += 18;
        matched = true;
      }
      if (category.includes(token)) {
        score += 15;
        matched = true;
      }
      if (authority.includes(token)) {
        score += 12;
        matched = true;
      }
      if (descEn.includes(token) || descMr.includes(token) || descHi.includes(token)) {
        score += 10;
        matched = true;
      }
      if (benefitsText.includes(token) || eligibilityText.includes(token)) {
        score += 8;
        matched = true;
      }

      if (matched) tokenMatchesCount++;
    }

    // Boost score if all tokens matched
    if (queryTokens.length > 1 && tokenMatchesCount >= queryTokens.length) {
      score += 30;
    }

    // Boost popular schemes slightly for tie-breaking
    if (scheme.isPopular) {
      score += 5;
    }

    if (score >= minScoreThreshold) {
      scoredResults.push({ scheme, score, matchedFields });
      seenIds.add(scheme.id);
    }
  }

  // Sort descending by score
  scoredResults.sort((a, b) => b.score - a.score);

  return scoredResults.map(r => r.scheme);
}

/**
 * Quick autocomplete / suggestion generator for hero search bar
 */
export function getSearchSuggestions(
  schemes: Scheme[],
  query: string,
  language: Language,
  maxResults = 5
): Array<{
  id: string;
  title: string;
  category: string;
  level: string;
  status: string;
  scheme: Scheme;
}> {
  if (!query || query.trim().length === 0) return [];

  const matched = searchSchemes(schemes, query);
  return matched.slice(0, maxResults).map(scheme => {
    const title = scheme.title?.[language] || scheme.name?.[language] || scheme.title?.en || '';
    return {
      id: scheme.id,
      title,
      category: scheme.category || 'all',
      level: scheme.level || 'Central',
      status: scheme.status || 'Open',
      scheme
    };
  });
}
