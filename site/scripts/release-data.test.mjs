import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectDownloads } from './release-data.mjs';

const digest = 'a'.repeat(64);
const previous = { macos: { version: '0.11.0-beta', download: 'https://github.com/uiukis/nook-releases/releases/download/v0.11.1-beta/Nook-macOS.dmg', sha256: digest } };
function release(tag = 'v0.11.1-beta') {
  return { tag_name: tag, draft: false, published_at: '2026-11-25T12:00:00Z', assets: ['Nook-win-x64-Setup.exe', 'Nook-win-arm64-Setup.exe', 'Nook-macOS.dmg', 'SHA256SUMS.txt'].map(name => ({ name, state: 'uploaded', size: 100, digest: 'sha256:' + digest, label: '', browser_download_url: `https://github.com/uiukis/nook-releases/releases/download/${tag}/${name}` })) };
}
test('an unchanged Mac binary keeps its actual version during a Windows update', () => {
  const value = selectDownloads([release()], previous);
  assert.equal(value.windows.version, '0.11.1-beta'); assert.equal(value.macos.version, '0.11.0-beta');
});
test('drafts never replace published downloads', () => {
  const draft = { ...release('v9.0.0'), draft: true };
  assert.equal(selectDownloads([draft, release()], previous).tag, 'v0.11.1-beta');
});
test('a mislabeled or missing ARM installer blocks synchronization', () => {
  const mismatched = release(); mismatched.assets[1].label = 'Windows ARM64 0.10.0-beta';
  assert.throws(() => selectDownloads([mismatched], previous), /versions/);
  const missing = release(); missing.assets.splice(1, 1);
  assert.throws(() => selectDownloads([missing], previous), /Missing/);
});
test('only exact public repository asset URLs are accepted', () => {
  const input = release(); input.assets[0].browser_download_url = input.assets[0].browser_download_url.replace('nook-releases/', 'nook/');
  assert.throws(() => selectDownloads([input], previous), /origin/);
});
test('a changed Mac binary needs an explicit version label', () => {
  const input = release(); input.assets[2].digest = 'sha256:' + 'b'.repeat(64);
  assert.throws(() => selectDownloads([input], previous), /Mac package/);
  input.assets[2].label = 'macOS 0.12.0-beta';
  assert.equal(selectDownloads([input], previous).macos.version, '0.12.0-beta');
});
test('an unpublished or unverifiable asset cannot be advertised', () => {
  const input = release(); input.assets[0].digest = null;
  assert.throws(() => selectDownloads([input], previous), /Unverified/);
});
test('Windows-only releases retain the already verified Mac download', () => {
  const input = release(); input.assets.splice(2, 1);
  assert.deepEqual(selectDownloads([input], previous).macos, previous.macos);
});
