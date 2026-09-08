export const CMS_ADMIN_EMAIL = 'sandrobellomind@gmail.com';

export function isAdminEmail(email){
  return typeof email === 'string' && email.trim().toLowerCase() === CMS_ADMIN_EMAIL;
}

export function safeNextPath(value, fallback='/cms'){
  if(typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return fallback;
  return value;
}
