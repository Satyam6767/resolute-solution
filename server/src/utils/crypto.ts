import CryptoJS from "crypto-js";

// Backend (2nd) encryption key — must NOT be the same as frontend key
const BACKEND_KEY = process.env.BACKEND_KEY || "backend-secret-key-32chars!!!!!!!";

/**
 * Applies the backend's AES encryption layer.
 * Input is already AES-encrypted by the frontend.
 */
export function encryptBackend(frontendCipher: string): string {
  return CryptoJS.AES.encrypt(frontendCipher, BACKEND_KEY).toString();
}

/**
 * Removes the backend's encryption layer.
 * Returns data that is still encrypted with the frontend key.
 */
export function decryptBackend(doubleCipher: string): string {
  const bytes = CryptoJS.AES.decrypt(doubleCipher, BACKEND_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * Applies backend encryption to all sensitive fields in a student document.
 */
export function encryptStudentBackend(
  student: Record<string, string>
): Record<string, string> {
  const sensitiveFields = [
    "fullName",
    "email",
    "phoneNumber",
    "dateOfBirth",
    "address",
    "password",
  ];
  const result: Record<string, string> = { ...student };
  for (const field of sensitiveFields) {
    if (result[field]) {
      result[field] = encryptBackend(result[field]);
    }
  }
  return result;
}

/**
 * Removes backend encryption from all sensitive fields.
 * Returns data still encrypted with the frontend key.
 */
export function decryptStudentBackend(
  student: Record<string, string>
): Record<string, string> {
  const sensitiveFields = [
    "fullName",
    "email",
    "phoneNumber",
    "dateOfBirth",
    "address",
  ];
  const result: Record<string, string> = { ...student };
  for (const field of sensitiveFields) {
    if (result[field]) {
      try {
        result[field] = decryptBackend(result[field]);
      } catch {
        // If decryption fails (e.g. non-encrypted field), leave as-is
      }
    }
  }
  return result;
}
