import { pathToRegexp } from 'path-to-regexp';

export function TestUrl(url: string): boolean {
  const allowedUrl = [
    pathToRegexp('/api/common/support-requests/:id/messages'),
    pathToRegexp('/api/common/support-requests/:id/messages/read'),
  ];
  let result: boolean = false;
  for (const pattern of allowedUrl) {
    if (pattern.regexp.test(url)) {
      result = true;
      break;
    }
  }
  return result;
}
