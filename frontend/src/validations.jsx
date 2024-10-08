export const validateItemContent = (content) => {
  if (!content || content.trim() === '') {
    return { isValid: false, message: 'Listan nimi ei voi olla tyhjä' };
  }

  if (content.length > 30) {
    return { isValid: false, message: 'Merkkiraja 30 ylittyi' };
  }

  return { isValid: true };
};

export const checkForDuplicateItem = (noteItems, content) => {
  const isDuplicate = noteItems.some(item => item === content);
  return !isDuplicate; 
};
