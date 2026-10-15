import type { SchemeRecord } from '../types';
import { VERIFIED_SCHEMES_SEED, UNIFIED_SCHEMES_SEED } from './verifiedSchemesSeed';

export { UNIFIED_SCHEMES_SEED, VERIFIED_SCHEMES_SEED };
export const unifiedSchemesData: SchemeRecord[] = VERIFIED_SCHEMES_SEED;

const LOCAL_STORAGE_SCHEMES_KEY = 'sahayakon_custom_schemes';

export function getCustomOrSeedSchemes(): SchemeRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SCHEMES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return unifiedSchemesData;
}

export function saveCustomSchemes(schemes: SchemeRecord[]): void {
  localStorage.setItem(LOCAL_STORAGE_SCHEMES_KEY, JSON.stringify(schemes));
}

export function resetCustomSchemesToSeed(): SchemeRecord[] {
  localStorage.removeItem(LOCAL_STORAGE_SCHEMES_KEY);
  return unifiedSchemesData;
}
