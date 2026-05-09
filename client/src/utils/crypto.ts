import CryptoJS from "crypto-js";

// Frontend encryption key — must match the one used when data was encrypted
// In production, derive this from env or a secure vault
const FRONTEND_KEY = process.env.REACT_APP_FRONTEND_KEY || "frontend-secret-key-32chars!!!!!";

/**
 * Encrypts a plain-text string using AES (frontend layer).
 */
export function encryptData(plainText: string): string {
  return CryptoJS.AES.encrypt(plainText, FRONTEND_KEY).toString();
}

/**
 * Decrypts data that was encrypted with the frontend key.
 * (Backend decrypts its own layer first, then sends this back.)
 */
export function decryptData(cipherText: string): string {
  const bytes = CryptoJS.AES.decrypt(cipherText, FRONTEND_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * Encrypts an entire student object's sensitive fields.
 */
export function encryptStudent(student: Record<string, string>): Record<string, string> {
  const sensitiveFields = ["fullName", "email", "phoneNumber", "dateOfBirth", "address", "password"];
  const result: Record<string, string> = { ...student };
  for (const field of sensitiveFields) {
    if (result[field]) {
      result[field] = encryptData(result[field]);
    }
  }
  return result;
}

/**
 * Decrypts an entire student object's sensitive fields.
 */
export function decryptStudent(student: Record<string, string>): Record<string, string> {
  const sensitiveFields = ["fullName", "email", "phoneNumber", "dateOfBirth", "address"];
  const result: Record<string, string> = { ...student };
  for (const field of sensitiveFields) {
    if (result[field]) {
      try {
        result[field] = decryptData(result[field]);
      } catch {
        // If decryption fails, leave as-is
      }
    }
  }
  return result;
}
