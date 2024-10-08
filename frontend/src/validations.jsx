
// Validate that the item content is not empty
export const validateItemContent = (content) => {
    if (!content || content.trim() === '') {
      return { isValid: false, message: 'Listan nimi ei voi olla tyhjä' };
    }
    
    if (content.length > 30) {
      return { isValid: false, message: 'Merkkiraja 30 ylittyi' };
    }
  
    return { isValid: true };
  };
  
  // Check for duplicate items in the list
  export const checkForDuplicateItem = (noteItems, content) => {
    const isDuplicate = noteItems.some(item => item.content === content);
    return !isDuplicate; 
  };
  
  // Confirmation for deletion
  export const confirmDeletion = () => {
    return window.confirm("Poistetaanko varmasti?'");
  };
  