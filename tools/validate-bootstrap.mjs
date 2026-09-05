
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const required = [
  'README.md', 'HANDOFF.md', 'AGENTS.md', 'docs/GAME_DESIGN.md',
  'docs/TECHNICAL_ARCHITECTURE.md', 'docs/CONTENT_SYSTEM.md',
  'docs/ART_DIRECTION.md', 'docs/BLENDER_PIPELINE.md', 'docs/AUDIO_DIRECTION.md',
  'docs/IMPLEMENTATION_SPEC.md', 'docs/MILESTONES.md', 'docs/ACCEPTANCE_CRITERIA.md',
  'docs/DECISIONS.md', 'docs/SOURCE_COVERAGE.md', 'docs/STATUS.md',
  'assets/ASSET_MANIFEST.csv', 'assets/source/concepts/history/concept-01.png',
  'assets/source/concepts/history/concept-02.png', 'tests/evidence/TEMPLATE.md',
  'docs/CONCEPT_ART_GALLERY.md', 'docs/BRANCH_DESIGN_ADDENDUM.md',
  'assets/source/concepts/history/manifest.json',
];
for (const p of required) if (!fs.existsSync(path.join(root, p))) errors.push('Missing: ' + p);
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    if (['.git', 'node_modules'].includes(e.name)) return [];
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}
const all = walk(root);
let links = 0;
for (const file of all.filter(p => p.endsWith('.md') && !p.includes(path.sep + 'sources' + path.sep))) {
  const body = fs.readFileSync(file, 'utf8');
  if (/[ \t]+$/m.test(body)) errors.push('Trailing whitespace: ' + path.relative(root, file));
  if (!body.endsWith('\n') || body.endsWith('\n\n')) errors.push('Expected one final newline: ' + path.relative(root, file));
  for (const match of body.matchAll(/\]\(([^)]+)\)/g)) {
    let target = match[1].replace(/^<|>$/g, '').split('#')[0];
    if (!target || /^[a-z]+:/i.test(target)) continue;
    links++;
    if (!fs.existsSync(path.resolve(path.dirname(file), decodeURIComponent(target)))) errors.push('Broken link in ' + path.relative(root, file) + ': ' + target);
  }
}
const coverageFile = path.join(root, 'docs/SOURCE_COVERAGE.md');
if (fs.existsSync(coverageFile)) {
  const ids = [...fs.readFileSync(coverageFile, 'utf8').matchAll(/^\| (\d+) \|/gm)].map(m => Number(m[1]));
  for (let n = 1; n <= 89; n++) if (ids.filter(x => x === n).length !== 1) errors.push('Foundation coverage missing/duplicated: ' + n);
}
for (const file of all.filter(p => p.endsWith('.json'))) {
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (file.endsWith('.plan.json') && (data.runtimeDefinition !== false || data.documentType !== 'design-plan')) errors.push('Planning fixture misrepresents runtime content: ' + file);
  } catch (e) { errors.push('Invalid JSON: ' + file + ': ' + e.message); }
}
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (pkg.name !== 'knockbound' || !pkg.private) errors.push('Package must be private knockbound bootstrap');
let conceptCount = 0;
const historyDir = path.join(root, 'assets/source/concepts/history');
try {
  const manifest = JSON.parse(fs.readFileSync(path.join(historyDir, 'manifest.json'), 'utf8'));
  const ledger = fs.readFileSync(path.join(root, 'assets/ASSET_MANIFEST.csv'), 'utf8');
  const gallery = fs.readFileSync(path.join(root, 'docs/CONCEPT_ART_GALLERY.md'), 'utf8');
  const seenFiles = new Set(), seenSources = new Set(), seenHashes = new Set();
  if (manifest.expectedGalleryImages !== 10 || manifest.assets.length !== 10) errors.push('Expected ten archived branch concepts');
  for (const asset of manifest.assets) {
    if (path.basename(asset.file) !== asset.file || !asset.file.endsWith('.png')) throw new Error('Invalid concept filename');
    if (seenFiles.has(asset.file) || seenSources.has(asset.sourceFileId) || seenHashes.has(asset.sha256)) errors.push('Duplicate concept: ' + asset.file);
    seenFiles.add(asset.file); seenSources.add(asset.sourceFileId); seenHashes.add(asset.sha256);
    const bytes = fs.readFileSync(path.join(historyDir, asset.file));
    if (bytes.length < 24 || bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error('Invalid PNG: ' + asset.file);
    if (bytes.length !== asset.bytes || bytes.readUInt32BE(16) !== asset.width || bytes.readUInt32BE(20) !== asset.height) errors.push('Concept dimensions/size mismatch: ' + asset.file);
    if (createHash('sha256').update(bytes).digest('hex') !== asset.sha256) errors.push('Concept hash mismatch: ' + asset.file);
    if (asset.status !== 'historical_exploratory_reference' || asset.visuallyReviewed !== true) errors.push('Missing reference review metadata: ' + asset.file);
    if (!ledger.includes('assets/source/concepts/history/' + asset.file + ',,reference_only')) errors.push('Concept absent from reference ledger: ' + asset.file);
    if (!gallery.includes('](' + '../assets/source/concepts/history/' + asset.file + ')')) errors.push('Concept absent from gallery: ' + asset.file);
    conceptCount++;
  }
  const diskImages = fs.readdirSync(historyDir).filter(n => n.endsWith('.png'));
  if (diskImages.length !== seenFiles.size || diskImages.some(n => !seenFiles.has(n))) errors.push('Concept files and manifest differ');
} catch (e) { errors.push('Concept archive validation failed: ' + e.message); }
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log('Bootstrap PASS: ' + required.length + ' required artifacts; 89 source sections; ' + links + ' local links; ' + conceptCount + ' unique concept originals verified; JSON metadata valid. Gameplay tests NOT RUN.');
