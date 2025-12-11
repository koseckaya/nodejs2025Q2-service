export function sanitize(input: any) {
  let obj: any = input;

  if (typeof input === 'string') {
    try {
      obj = JSON.parse(input);
    } catch {
      return input;
    }
  }

  if (obj && typeof obj === 'object') {
    const clone = { ...obj };
    if ('password' in clone) clone.password = '***';
    if ('token' in clone) clone.token = '***';
    if ('accessToken' in clone) clone.accessToken = '***';
    if ('refreshToken' in clone) clone.refreshToken = '***';
    return typeof input === 'string' ? JSON.stringify(clone) : clone;
  }

  return input;
}
