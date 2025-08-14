import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const secretKey = process.env.CRYPTO_SECRET_KEY; 
const ivLength = 16; 

export function encrypt(text) {
  if (!text) return null;
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // retorna IV + texto criptografado 
  return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(encryptedText) {
  if (!encryptedText) return null;
  const [ivHex, encrypted] = encryptedText.split(':');
  if (!ivHex || !encrypted) return null;
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
