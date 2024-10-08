// src/ListItem.jsx

import React from 'react';
import { validateItemContent, checkForDuplicateItem } from './validations'; // Import validations

const ListItem = ({ item, deleteNoteItem, updateNoteItem, noteItems }) => {
  if (!item) return null; // Return null if item is undefined

  const handleUpdate = () => {
    const updatedContent = prompt("Päivitä", item.content);
    const validation = validateItemContent(updatedContent);
    
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    // Check for duplicates
    if (!checkForDuplicateItem(noteItems, updatedContent)) {
      alert('Tämä on jo listalla');
      return;
    }

    updateNoteItem({ ...item, content: updatedContent }); 
  };

  return (
    <li>
      {item.content} 
      <button onClick={() => deleteNoteItem(item.id)}>Poista</button>
    </li>
  );
};

export default ListItem;

