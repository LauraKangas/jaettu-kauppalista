/**
 * Copies a code to the clipboard and shows a notification based on success or failure.
 * 
 * @param {string} code - The code to be copied to the clipboard.
 * @param {Function} enqueueSnackbar - Function to show notifications to the user.
 */
export const handleCopyCode = (code, enqueueSnackbar) => {
  navigator.clipboard.writeText(code)  
    .then(() => {
      enqueueSnackbar('Koodi kopioitu leikepöydälle!', { variant: 'success' });
    })
    .catch((error) => {
      enqueueSnackbar('Virhe koodin kopioinnissa. Yritä hetken kuluttua uudelleen.', { variant: 'error' });
    });
};
