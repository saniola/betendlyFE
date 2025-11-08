export function testEmail(v: string) {
  return /.+@.+\..+/.test(v) || 'E-mail must be valid.';
}
