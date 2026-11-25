const repository = 'uiukis/nook-releases';
const versionPattern = /\b(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?)\b/;

function asset(release, name) {
  const value = release.assets?.find(item => item.name === name && item.state === 'uploaded');
  if (!value) throw new Error(`Missing uploaded asset: ${name}`);
  const expected = `https://github.com/${repository}/releases/download/${encodeURIComponent(release.tag_name)}/${name}`;
  if (value.browser_download_url !== expected) throw new Error(`Unexpected download origin: ${name}`);
  if (!value.size || !/^sha256:[a-f0-9]{64}$/.test(value.digest || '')) throw new Error(`Unverified asset: ${name}`);
  return { url: value.browser_download_url, hash: value.digest.slice(7), version: value.label?.match(versionPattern)?.[1] };
}

export function selectDownloads(input, previous) {
  if (!Array.isArray(input)) throw new Error('Unexpected release response');
  const published = input.filter(item => !item.draft && item.published_at).sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at));
  const latest = published[0];
  if (!latest) throw new Error('No published release found');
  const windowsRelease = published.find(item => item.assets?.some(file => file.name === 'Nook-win-x64-Setup.exe'));
  if (!windowsRelease) throw new Error('No Windows installer release found');
  const x64 = asset(windowsRelease, 'Nook-win-x64-Setup.exe');
  const arm64 = asset(windowsRelease, 'Nook-win-arm64-Setup.exe');
  const windowsVersion = x64.version || windowsRelease.tag_name.replace(/^v/, '').match(versionPattern)?.[1];
  if (!windowsVersion || (arm64.version && arm64.version !== windowsVersion)) throw new Error('Windows installer versions do not match');
  const macRelease = published.find(item => item.assets?.some(file => file.name === 'Nook-macOS.dmg'));
  let macos;
  if (macRelease) {
    const mac = asset(macRelease, 'Nook-macOS.dmg');
    const macVersion = mac.version || (mac.hash === previous?.macos?.sha256 ? previous.macos.version : null);
    if (!macVersion) throw new Error('A new Mac package needs its app version in the GitHub asset label');
    macos = { version: macVersion, download: mac.url, sha256: mac.hash };
  } else {
    if (!previous?.macos?.download?.startsWith(`https://github.com/${repository}/releases/download/`)) throw new Error('No verified Mac package found');
    macos = previous.macos;
  }
  const checksum = asset(latest, 'SHA256SUMS.txt');
  return {
    schemaVersion: 1, repository, tag: latest.tag_name,
    releaseUrl: `https://github.com/${repository}/releases/tag/${encodeURIComponent(latest.tag_name)}`,
    publishedAt: latest.published_at, checksums: checksum.url, macos,
    windows: { version: windowsVersion, x64: x64.url, arm64: arm64.url, sha256: { x64: x64.hash, arm64: arm64.hash } },
  };
}
