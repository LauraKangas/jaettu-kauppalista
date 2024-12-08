/**
 * Validates the content of a list item.
 * 
 * This function checks whether the provided content (e.g., list item name) is valid.
 * It performs the following validations:
 * - Ensures the content is not empty or just whitespace.
 * - Ensures the content length does not exceed a specified character limit (30 characters).
 * 
 * @param {string} content - The content (e.g., name or description) to validate.
 * @returns {Object} - An object indicating whether the content is valid and a corresponding message.
 * @returns {boolean} isValid - A boolean indicating whether the content is valid.
 * @returns {string} message - A message providing details if the validation fails, or an empty string if the content is valid.
 */
export const validateItemContent = (content) => {
  if (!content || content.trim() === '') {
    return { isValid: false, message: 'Listan nimi ei voi olla tyhjä' };
  }

  if (content.length > 30) {
    return { isValid: false, message: 'Merkkiraja 30 ylittyi' };
  }

  return { isValid: true };
};

/**
 * Checks if the content already exists in the list of items.
 * 
 * This function checks if the provided content (e.g., a list item) is already present in the existing list.
 * It helps in ensuring that duplicate items are not added to the list.
 *
 * @param {Array} noteItems - An array of current items (strings) in the list.
 * @param {string} content - The content (item) to check for duplication.
 * @returns {boolean} - Returns `true` if the item is not a duplicate, and `false` if it is.
 */
export const checkForDuplicateItem = (noteItems, content) => {
  const isDuplicate = noteItems.some(item => item === content);
  return !isDuplicate;
};
