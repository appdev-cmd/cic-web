import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { representativePartnerCountries, representativePartners } from '../src/web/data/representativePartners';

const fail = (message: string): never => { throw new Error(message); };
if (representativePartnerCountries.length !== 17) fail(`Expected 17 countries, got ${representativePartnerCountries.length}`);
if (representativePartners.length !== 35) fail(`Expected 35 deduplicated brands, got ${representativePartners.length}`);

const expectedCountrySizes: Readonly<Record<string, number>> = {
  usa: 11, canada: 1, uk: 3, ireland: 1, france: 1, netherlands: 1,
  germany: 3, switzerland: 1, italy: 2, czechia: 1, sweden: 2,
  norway: 1, israel: 1, china: 2, 'south-korea': 1, singapore: 1, australia: 2,
};
for (const country of representativePartnerCountries) {
  if (country.partners.length !== expectedCountrySizes[country.id]) fail(`Unexpected partner mapping for ${country.id}`);
  if (country.partners.some((item) => item.country !== country.id)) fail(`Country ownership mismatch in ${country.id}`);
}

const ids = new Set<string>();
const files = new Set<string>();
for (const item of representativePartners) {
  if (ids.has(item.id)) fail(`Duplicate partner identity: ${item.id}`);
  ids.add(item.id);
  if (item.logo.fit !== 'contain') fail(`Non-contain logo contract: ${item.id}`);
  if (!['official-site', 'provided-source-reviewed'].includes(item.logo.verification)) fail(`Unverified logo contract: ${item.id}`);
  if (!item.logo.src.startsWith('/partner-map-logos/')) fail(`Asset outside new folder: ${item.logo.src}`);
  const relative = `public${item.logo.src}`;
  const absolute = resolve(relative);
  statSync(absolute);
  const bytes = readFileSync(absolute);
  const isPng = bytes.length > 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const isSvg = bytes.subarray(0, 1024).toString('utf8').match(/<svg\b/i);
  if (!isPng && !isSvg) fail(`Undetected/invalid logo format: ${relative}`);
  files.add(relative);
}

if (representativePartners.filter((item) => item.id === 'glodon').length !== 1) fail('Glodon was not deduplicated to exactly one brand');
if (files.size !== 35) fail(`Expected 35 unique logo assets, got ${files.size}`);
if (existsSync(resolve('src/web/data/partnerBranchesData.ts'))) fail('Legacy 77-partner source still exists');
const sectionSource = readFileSync(resolve('src/web/components/GlobalPartnerMap.tsx'), 'utf8');
if (/partnerBranches|77\+|Hãng đối tác|20 Quốc gia/.test(sectionSource)) fail('Legacy partner metadata is still rendered');

console.log(`PASS: ${representativePartnerCountries.length} countries, ${representativePartners.length} deduplicated brands, ${files.size} valid assets`);
