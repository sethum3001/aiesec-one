/**
 * Validates if the provided ID is a valid MongoDB ObjectId.
 * @param {string} id - The ID to validate.
 * @returns {boolean} - True if the ID is valid, false otherwise.
 */
export function isValidId(id: string): boolean {
  return !!(id && id.length === 24);
}
