import { randomBytes } from 'crypto';

// URL-safe, good entropy; trim to length
export function makeSlug(length = 10) {
  return randomBytes(Math.ceil(length * 0.75))
    .toString('base64url')
    .slice(0, length);
}
