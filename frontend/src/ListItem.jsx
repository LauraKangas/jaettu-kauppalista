/*
import React from 'react';
import { validateItemContent, checkForDuplicateItem, confirmDeletion } from './Validations';

const ListItem = ({ item, deleteNoteItem, updateNoteItem, noteItems }) => {
    if (!item) return null;

    const handleUpdate = () => {
        const updatedContent = prompt("Päivitä", item.content);
        const validation = validateItemContent(updatedContent);
        
        if (!validation.isValid) {
            alert(validation.message);
            return;
        }

        if (!checkForDuplicateItem(noteItems, updatedContent)) {
            alert('Tämä on jo listalla');
            return;
        }

        updateNoteItem({ ...item, content: updatedContent });
    };

    const handleDelete = () => {
        if (confirmDeletion()) {
            deleteNoteItem(item.id);
        }
    };

    return (
        <li>
            {item.content} 
            <button onClick={handleUpdate}>Päivitä</button>
            <button onClick={handleDelete}>Poista</button>
        </li>
    );
};

export default ListItem;
*/