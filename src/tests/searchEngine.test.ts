import { describe, it, expect } from 'vitest';
import { searchSchemes, getSearchSuggestions, normalizeText } from '../services/searchEngine';
import { schemesData } from '../data/schemesData';

describe('Search Engine - Multilingual & Fuzzy Scheme Discovery', () => {
  it('normalizes whitespace and case properly', () => {
    expect(normalizeText('  PM   KISAN  ')).toBe('pm kisan');
    expect(normalizeText('शिष्यवृत्ती   योजना')).toBe('शिष्यवृत्ती योजना');
  });

  it('searches by English scheme name (exact and partial)', () => {
    const results = searchSchemes(schemesData, 'pm-kisan');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe('pm-kisan');

    const partialResults = searchSchemes(schemesData, 'vishwakarma');
    expect(partialResults.some(s => s.id.includes('vishwakarma'))).toBe(true);
  });

  it('searches by Marathi scheme name and keywords', () => {
    const results = searchSchemes(schemesData, 'लाडकी बहीण');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title.mr).toContain('लाडकी बहीण');

    const kisanResults = searchSchemes(schemesData, 'शेतकरी');
    expect(kisanResults.length).toBeGreaterThan(0);
  });

  it('searches by Hindi scheme name', () => {
    const results = searchSchemes(schemesData, 'आयुष्मान भारत');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toContain('ayushman');
  });

  it('searches by category and department keywords', () => {
    const results = searchSchemes(schemesData, 'scholarship');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(s => s.category === 'students' || s.category === 'scholarships')).toBe(true);
  });

  it('searches by benefits and eligibility text', () => {
    const results = searchSchemes(schemesData, '6000');
    expect(results.some(s => s.id === 'pm-kisan' || s.id === 'namo-shetkari-maharashtra')).toBe(true);
  });

  it('generates real-time suggestions while typing', () => {
    const suggestions = getSearchSuggestions(schemesData, 'ladki', 'mr');
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0].title).toContain('लाडकी बहीण');
  });

  it('prevents duplicate scheme IDs in results', () => {
    const results = searchSchemes(schemesData, 'maharashtra government scheme');
    const ids = results.map(s => s.id);
    const uniqueIds = Array.from(new Set(ids));
    expect(ids.length).toBe(uniqueIds.length);
  });
});
