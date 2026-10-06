/**
 * Canonical cloud-provider taxonomy.
 *
 * The content records cloud platforms under whatever name the author happened to
 * use: `AWS`, `Microsoft Azure`, `Google Cloud`, `AWS Cloud Quest`, `Oracle`.
 * Counting those strings directly gives a wrong answer in both directions —
 * `AWS` and `AWS Cloud Quest` are one provider, and `Azure` and `Microsoft
 * Azure` are one provider.
 *
 * So every alias maps to a canonical id, and only the canonical id is ever
 * counted. Matching is exact on a normalised token, never a substring: a
 * substring match would count `Azure DevOps` and `AWSome` as providers, and
 * would quietly turn a service name into a platform.
 *
 * `findUnknownCloudTokens` exists for the case this map cannot handle by
 * itself — a new provider appearing in the data with no alias yet. Silently
 * not counting it would leave a number that is wrong and looks right.
 */

export type CloudProviderId = 'aws' | 'azure' | 'google-cloud' | 'oracle-cloud';

/** Display name for each canonical provider. */
export const CLOUD_PROVIDER_LABELS: Readonly<Record<CloudProviderId, string>> = {
  aws: 'AWS',
  azure: 'Microsoft Azure',
  'google-cloud': 'Google Cloud',
  'oracle-cloud': 'Oracle Cloud',
};

export const CLOUD_PROVIDER_IDS: readonly CloudProviderId[] = [
  'aws',
  'azure',
  'google-cloud',
  'oracle-cloud',
];

/**
 * Alias to canonical provider.
 *
 * Keys are normalised: lower case, whitespace collapsed. Add a new spelling
 * here rather than editing the data — the data is the owner's, and a
 * variation in a cell should not require a content change.
 */
export const CLOUD_PROVIDER_ALIASES: Readonly<Record<string, CloudProviderId>> = {
  aws: 'aws',
  'amazon web services': 'aws',
  'amazon web services (aws)': 'aws',
  'aws cloud': 'aws',
  'aws cloud quest': 'aws',

  azure: 'azure',
  'microsoft azure': 'azure',
  microsoft: 'azure',

  'google cloud': 'google-cloud',
  gcp: 'google-cloud',
  'google cloud platform': 'google-cloud',

  oracle: 'oracle-cloud',
  'oracle cloud': 'oracle-cloud',
  'oracle cloud infrastructure': 'oracle-cloud',
  oci: 'oracle-cloud',
};

/** Normalise a token for alias lookup. */
export function normaliseToken(token: string): string {
  return token.trim().replace(/\s+/g, ' ').toLowerCase();
}

/** Resolve one token to its canonical provider, or null if it is not one. */
export function cloudProviderOf(token: string): CloudProviderId | null {
  return CLOUD_PROVIDER_ALIASES[normaliseToken(token)] ?? null;
}

/**
 * Tokens that look like a cloud provider but resolve to none.
 *
 * A deliberately loose net over the words that mark a provider, so a new
 * spelling surfaces at build time instead of quietly not being counted.
 */
const CLOUD_HINT = /\b(aws|azure|gcp|oci|cloud)\b/i;

export function findUnknownCloudTokens(tokens: Iterable<string>): readonly string[] {
  const unknown = new Set<string>();
  for (const token of tokens) {
    if (cloudProviderOf(token) === null && CLOUD_HINT.test(token)) {
      unknown.add(token);
    }
  }
  return [...unknown].sort();
}