import crypto from "crypto";

// Encryption key and initialization vector (should be environment variables in production)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "32-char-str-for-pwd-encryption-key"; // Must be 32 bytes for AES-256
const IV_LENGTH = 16; // For AES, this is always 16

/**
 * Encrypts sensitive data using AES-256-CBC
 * @param text - The text to encrypt
 * @returns Encrypted text in format: iv:encryptedData (base64 encoded)
 */
export function encryptData(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  
  // Return iv and encrypted data
  return `${iv.toString("hex")}:${encrypted}`;
}

/**
 * Decrypts data that was encrypted with encryptData
 * @param encryptedText - The text to decrypt in format: iv:encryptedData
 * @returns Decrypted text
 */
export function decryptData(encryptedText: string): string {
  try {
    const [ivHex, encryptedData] = encryptedText.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
    
    let decrypted = decipher.update(encryptedData, "base64", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
  } catch (error) {
    throw new Error("Failed to decrypt data");
  }
}

/**
 * Hash a password for storage
 * @param password - The password to hash
 * @returns Encrypted password
 */
export function encryptPassword(password: string): string {
  return encryptData(password);
}

/**
 * Decrypt a stored password for comparison
 * @param encryptedPassword - The encrypted password
 * @returns Decrypted password
 */
export function decryptPassword(encryptedPassword: string): string {
  return decryptData(encryptedPassword);
}

/**
 * Compare a plain password with a decrypted password
 * @param plainPassword - The password to check
 * @param decryptedPassword - The decrypted password to compare against
 * @returns Boolean indicating if passwords match
 */
export function comparePasswords(plainPassword: string, decryptedPassword: string): boolean {
  return plainPassword === decryptedPassword;
}

/**
 * Mask sensitive data (e.g., account numbers)
 * @param text - Text to mask
 * @param visibleChars - Number of characters to leave visible at the end
 * @returns Masked text
 */
export function maskSensitiveData(text: string, visibleChars = 4): string {
  if (!text || text.length <= visibleChars) return text;
  
  const mask = "•".repeat(text.length - visibleChars);
  const visiblePart = text.slice(-visibleChars);
  
  return `${mask}${visiblePart}`;
}
