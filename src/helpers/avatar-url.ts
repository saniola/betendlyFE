const DEFAULT_AVATAR_ORIGIN = 'https://betendly-api.azurewebsites.net';

function resolveOrigin(candidate?: string) {
  if (!candidate) return undefined;

  try {
    return new URL(candidate).origin;
  } catch {
    if (typeof window !== 'undefined') {
      try {
        return new URL(candidate, window.location.origin).origin;
      } catch {
        return undefined;
      }
    }
    return undefined;
  }
}

const apiOrigin = (() => {
  const explicitOrigin =
    resolveOrigin(import.meta.env.VITE_AVATAR_ORIGIN) ||
    resolveOrigin(import.meta.env.VITE_API_URL);

  if (explicitOrigin) {
    return explicitOrigin;
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return DEFAULT_AVATAR_ORIGIN;
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

