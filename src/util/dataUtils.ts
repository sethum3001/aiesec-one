/**
 * Validates if the provided ID is a valid MongoDB ObjectId.
 * @param {string} id - The ID to validate.
 * @returns {boolean} - True if the ID is valid, false otherwise.
 */
export function isValidId(id: string): boolean {
  return !!(id && id.length === 24);
}

/**
 * Validates if the provided value is not empty.
 * @param {string} value - The value to validate.
 * @returns {boolean} - True if the value is not empty, false otherwise.
 */
export function validateRequired(value: string): boolean {
  return !!value.length;
}

/**
 * Validates if the provided URL is valid.
 * @param {string} url - The URL to validate.
 * @returns {boolean} - True if the URL is valid, false otherwise.
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}
