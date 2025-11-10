export function tokenHasExpired(): boolean {
  const expireDate = localStorage.getItem('tokenExpire');
  return Boolean(expireDate && new Date(expireDate).getTime() < new Date().getTime());
}
