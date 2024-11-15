import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './utils/firebase/app'; 
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { Button, IconButton } from '@mui/material';
import { useSnackbar } from 'notistack'; 
import LoginIcon from '@mui/icons-material/Login';

const PinPage = ({ setUserPin }) => {
  const [generatedPin, setGeneratedPin] = useState('');
  const [inputPin, setInputPin] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar(); 

  const generatePin = async () => {
    const pin = generateSixDigitPin(); 
    const pinRef = doc(db, 'pins', pin); 

    const pinSnap = await getDoc(pinRef);
    if (pinSnap.exists()) {
      enqueueSnackbar("Tämä käyttäjäkoodi on jo varattu. Ole hyvä ja yritä uudelleen.", { variant: 'error' });
      return; 
    }

    await setDoc(pinRef, { pin });

    setGeneratedPin(pin);
    localStorage.setItem("userPin", pin); 
    setUserPin(pin); 

    enqueueSnackbar(`Käyttäjäkoodisi on: ${pin}`, { variant: 'success' });
  };

  const generateSixDigitPin = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleInputChange = (event) => {
    setInputPin(event.target.value);
  };

  const accessData = async () => {
    if (!inputPin) {
      enqueueSnackbar("Ole hyvä ja anna oikea käyttäjäkoodi.", { variant: 'warning' });
      return;
    }

    const pinRef = doc(db, 'pins', inputPin); 
    const pinSnap = await getDoc(pinRef); 

    if (pinSnap.exists()) {
      setUserPin(inputPin); 
      localStorage.setItem("userPin", inputPin); 
      navigate("/lists"); 
    } else {
      enqueueSnackbar("Väärä käyttäjäkoodi.", { variant: 'error' });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      accessData();
    }
  };

  return (
    <div>
      <h2>Tervetuloa!</h2>
      <p>Alla voit kirjautua käyttäjäkoodillasi. Uniikin koodisi avulla 
        voit hallinnoida ja jakaa luomiasi listoja ystäviesi kanssa!</p>
        <div>
        <h3>Kirjaudu sisään</h3>
        <input
          type="text"
          value={inputPin}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress} 
          placeholder="Kirjoita koodisi tähän..."
        />
        <Button onClick={accessData}>
          <LoginIcon />
        </Button>
      </div>
      <p>Ei vielä käyttäjäkoodia? Luo se alla ja olet valmis käyttämään listoja!</p>
    
      <div>
        <Button onClick={generatePin}>Luo käyttäjäkoodi</Button>
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





