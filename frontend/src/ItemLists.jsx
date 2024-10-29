import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, deleteDoc } from 'firebase/firestore'; 
import { db } from './utils/firebase/app'; 
import { validateItemContent } from './Validations'; 
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import createList from './functions/lists/createList'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const ItemLists = ({ noteItems, setNoteItems, uid, setUid }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const loginUser = async () => {
    const {user} = await signInWithEmailAndPassword(getAuth(), email, password)
    setUid(user.uid)
  }

  const handleCreateList = async () => {
    const validation = validateItemContent(name);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    const content = { items: [], name, sharedTo: [uid] }
    const newList = await createList(content)
    setNoteItems(prevItems => [...prevItems, { id: newList.id, ...content }])
    setName('')
  };

  const handleDeleteList = async (id) => {
    await deleteDoc(doc(db, 'lists', id));
    setNoteItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Sähköposti"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Salasana"
      />
      <button onClick={loginUser}>
        Kirjaudu sisään
      </button>
      <div style={{ visibility: uid ? 'visible' : 'hidden' }}>
        <h1>Omat listat</h1>
        <ul>
          {noteItems.map((item) => (
            <li key={item.id}>
              <Link to={`/list/${item.id}`}>{item.name}</Link>
              <button onClick={() => handleDeleteList(item.id)}>
                <DeleteIcon /> 
              </button>
            </li>
          ))}
        </ul>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Kirjoita listan nimi..."
        />
        <button onClick={handleCreateList}>
          <AddIcon /> 
        </button>
      </div>
    </div>
  );
};

export default ItemLists;


