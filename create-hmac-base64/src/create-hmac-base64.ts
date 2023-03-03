import * as crypto from 'crypto';

export const createHMAC = (baseString: string, key: string): string => {
  const hmac = crypto.createHmac('sha256', key);
  hmac.update(baseString);
  const digest = hmac.digest();
  return digest.toString('base64');
};
