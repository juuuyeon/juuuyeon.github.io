/**
 * GitHub Pages redirects directory routes to a trailing slash.
 * Keep the application's route matching independent of that redirect.
 */
export function getRoutePath(pathname = '/') {
  if (typeof pathname !== 'string') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}
