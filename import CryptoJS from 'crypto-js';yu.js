import CryptoJS from 'crypto-js';

// Encryption key (would be from environment variables in production)
const ENCRYPTION_KEY = "crypto-bank-client-side-encryption-key";

/**
 * Encrypts data using AES encryption
 * @param data - The data to encrypt
 * @returns Encrypted data string
 */
export function encryptData(data: string): string {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
}

/**
 * Decrypts data that was encrypted with encryptData
 * @param encryptedData - The data to decrypt
 * @returns Decrypted data string
 */
export function decryptData(encryptedData: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * Masks an account number or other sensitive data
 * @param text - The text to mask
 * @param visibleChars - Number of characters to show at the end
 * @returns Masked string
 */
export function maskAccountNumber(text: string, visibleChars = 4): string {
  if (!text) return '';
  
  const visible = text.slice(-visibleChars);
  const masked = '•'.repeat(Math.max(0, text.length - visibleChars));
  
  return `${masked}${visible}`;
}

/**
 * Formats currency values
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
}

/**
 * Parses a currency string into a number
 * @param currency - The currency string to parse
 * @returns Numeric value
 */
export function parseCurrency(currency: string): number {
  if (!currency) return 0;
  
  // Remove currency symbol, dots, and replace comma with dot
  const cleaned = currency
    .replace(/[^\d,.-]/g, '')
    .replace('.', '')
    .replace(',', '.');
  
  return parseFloat(cleaned);
}
