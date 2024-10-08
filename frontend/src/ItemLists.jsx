// src/ItemLists.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import ListItem from './ListItem'; 
import { validateItemContent, checkForDuplicateItem, confirmDeletion } from "./validations"; 

const ItemLists = ({ noteItems, addNoteItem, deleteNoteItem, updateNoteItem }) => {
  const handleAddList = () => {
    const newListName = prompt("Listan nimi"); 
    const validation = validateItemContent(newListName);

    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    if (!checkForDuplicateItem(noteItems, newListName)) {
      alert('Listan nimi jo käytössä'); 
      return;
    }

    const newItem = {
      id: Date.now(),
      content: newListName,
      items: [] 
    };

    addNoteItem(newItem); 
  };

  return (
    <div>
    <h1>Jaettu lista</h1>
      <button onClick={handleAddList}>Lisää uusi lista</button>
      <ul>
        {noteItems.map(item => (
          <li key={item.id}>
            <Link to={`/list/${item.id}`}>{item.content}</Link> {/* Link to the new list view */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemLists;
