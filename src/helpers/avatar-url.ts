const apiOrigin = (() => {
  const apiUrl = import.meta.env.VITE_API_URL;

  try {
    if (apiUrl) {
      return new URL(apiUrl).origin;
    }

    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
  } catch (error) {
    console.warn('Failed to parse API url for avatar origin', error);
  }

  return undefined;
})();

function ensureLeadingSlash(path: string) {
  if (!path.startsWith('/')) {
    return `/${path}`;
  }

  return path;
}

export function buildAvatarUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^(https?:|data:)/i.test(path)) {
    return path;
  }

  if (!apiOrigin) {
    return path;
  }

  try {
    return new URL(ensureLeadingSlash(path), apiOrigin).href;
  } catch {
    return path;
  }
}

export function extractAvatarPath(fullUrl?: string | null): string | null | undefined {
  if (!fullUrl || !apiOrigin) return fullUrl;

  if (fullUrl.startsWith(apiOrigin)) {
    return fullUrl.slice(apiOrigin.length) || '/';
  }

  return fullUrl;
}

