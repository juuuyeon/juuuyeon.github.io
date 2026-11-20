/**
 * Build-only public asset policy.
 *
 * The excluded archives may contain unverified personal/contact data. This
 * policy omits them from the website payload, not from local source files or
 * Git history. Call with a path relative to public/ (a leading slash is OK).
 */
const reviewedPreviews = new Set([
  'resources/yeosu-admin-original/2001-20906.jpg',
  'resources/yeosu-admin-original/2001-20906.jpg.webp',
  'resources/yeosu-admin-original/2001-21873.jpg',
  'resources/yeosu-admin-original/2001-21873.jpg.webp',
]);
const privateArchive = /^resources\/(?:jnj-game|yeosu-admin-original|yeosu-guide-original)(?:\/|\.(?:html|json|pdf)$|$)/;
const privateGeneratedViewer = /^resources\/(?:yeosu-admin|yeosu-guide|yeosu-demo)\.(?:html|pdf)$/;

export function shouldPublishAsset(relativePath) {
  const normalized = relativePath.replaceAll('\\', '/').replace(/\/+/g, '/').replace(/^\//, '');
  if (reviewedPreviews.has(normalized)) return true;
  return !privateArchive.test(normalized) && !privateGeneratedViewer.test(normalized);
}
