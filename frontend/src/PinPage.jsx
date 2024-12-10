import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './utils/firebase/app';
import { Button, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import LoginIcon from '@mui/icons-material/Login';
import Key from '@mui/icons-material/Key';
import { accessData } from './functions/pins/accessData';
import { generatePin } from './functions/pins/generatePin';
/**
 * The `PinPage` component serves as the entry point for users to log in or generate a new PIN.
 * It allows users to either:
 * - Enter an existing PIN to gain access to their data.
 * - Generate a new PIN if they are a first-time user.
 *
 * This page is designed to:
 * - Redirect authenticated users (with a saved PIN in `localStorage`) to the `/lists` route.
 * - Allow new or unauthenticated users to proceed based on their input.
 *
 * @component
 * @returns {JSX.Element} A page where users can log in or generate a new user PIN.
 */
const PinPage = () => {
  const [generatedPin, setGeneratedPin] = useState('');
  const [inputPin, setInputPin] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  /**
   * Effect to check if a user PIN exists in `localStorage`. If a PIN is found,
   * the user is redirected to the `/lists` page automatically.
   */
  useEffect(() => {
    const savedPin = localStorage.getItem('userPin');
    if (savedPin) {
      navigate('/lists');
    }
  }, [navigate]);
  /**
   * Updates the state of the `inputPin` when the user types in the input field.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The event object from the input field.
   */
  const handleInputChange = (event) => {
    setInputPin(event.target.value);
  };
  /**
   * Handles the "Enter" key press event for the input field.
   * When the user presses "Enter," it triggers the `accessData` function.
   * @param {React.KeyboardEvent<HTMLInputElement>} event - The event object from the input field.
   */
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      accessData(inputPin, db, enqueueSnackbar, navigate);
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2>Tervetuloa!</h2>
    </div>
        <p>
            "ListFun tekee arjen listauksista hauskoja ja helppoja!"<br></br>
            Täällä voit luoda, muokata ja jakaa muistilistoja ystävien, perheen tai kämppisten kanssa.<br></br>
            Ei enää kadonneita muistilappuja – kaikki on näppärästi yhdessä paikassa!<br></br>
            <br></br>
            Näin pääset alkuun:<br></br>
            <br></br>
            Luo oma käyttäjäkoodisi ja kirjaudu sisään.<br></br>
            Lisää listasi ja kutsu ystävät mukaan.<br></br>
            Anna ListFunin pitää asiat järjestyksessä puolestasi.<br></br>
            &#128274; Huom: Käyttäjäkoodisi on henkilökohtainen. Pidä se tallessa ja omana tietonasi. Emme voi palauttaa sitä, jos unohdat sen.
        </p>

      <div>
        <h3>Kirjaudu sisään</h3>
        <TextField
          label="Kirjoita koodisi tähän..."
          variant="outlined"
          color="black"
          size="small"
          value={inputPin}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <Button onClick={() => accessData(inputPin, db, enqueueSnackbar, navigate)}>
          <LoginIcon />
        </Button>
      </div>
      <p>Ei vielä käyttäjäkoodia? Luo se alla ja olet valmis käyttämään listoja!</p>

      <div>
        <Button onClick={() => generatePin(db, setGeneratedPin, enqueueSnackbar)}>
          Luo käyttäjäkoodi <Key />
        </Button>
        {generatedPin && (
          <div>
            <p>Käyttäjäkoodisi on: <strong>{generatedPin}</strong></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PinPage;

