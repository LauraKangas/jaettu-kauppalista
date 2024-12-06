import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './utils/firebase/app';
import { Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import LoginIcon from '@mui/icons-material/Login';
import Key from '@mui/icons-material/Key';
import { accessData } from './functions/pins/accessData';
import { generatePin } from './functions/pins/generatePin';

const PinPage = () => {
  const [generatedPin, setGeneratedPin] = useState('');
  const [inputPin, setInputPin] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const savedPin = localStorage.getItem('userPin');
    if (savedPin) {
      navigate('/lists');
    }
  }, [navigate]);

  const handleInputChange = (event) => {
    setInputPin(event.target.value);
  };

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
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>

      <div>
        <h3>Kirjaudu sisään</h3>
        <input
          type="text"
          value={inputPin}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Kirjoita koodisi tähän..."
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

