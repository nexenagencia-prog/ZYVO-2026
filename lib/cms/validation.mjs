const IMAGE_TYPES = new Set(['image/jpeg','image/png','image/webp']);
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export function validatePercentage(value){
  const n = Number(value);
  if(!Number.isFinite(n) || n < 0 || n > 100) throw new Error('Percentual deve estar entre 0 e 100.');
  return Math.round(n);
}

export function validatePassword(password, confirmation){
  if(typeof password !== 'string' || password.length < 12) throw new Error('A senha precisa ter pelo menos 12 caracteres.');
  if(password !== confirmation) throw new Error('As senhas não coincidem.');
  return password;
}

export function validateImage(file){
  if(!file) throw new Error('Selecione uma imagem.');
  if(!IMAGE_TYPES.has(file.type)) throw new Error('Use JPEG, PNG ou WebP.');
  if(file.size > MAX_IMAGE_BYTES) throw new Error('A imagem deve ter no máximo 10 MB.');
  return true;
}

export function validateRequiredText(value, label='Campo'){
  if(typeof value !== 'string' || value.trim().length === 0) throw new Error(`${label} é obrigatório.`);
  return value.trim();
}
