export const handleCopyCode = (code, enqueueSnackbar) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        enqueueSnackbar('Koodi kopioitu leikepöydälle!', { variant: 'success' });
      })
      .catch((error) => {
        enqueueSnackbar('Virhe koodin kopioinnissa. Yritä hetken kuluttua uudelleen.', { variant: 'error' });
      });
  };
  