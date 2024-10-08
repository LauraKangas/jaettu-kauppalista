// src/ListView.jsx

import React, { useState, useEffect } from 'react'; // Import useEffect for updating currentList
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import ListItem from './ListItem'; // Import ListItem component

const ListView = ({ noteItems, updateNoteItem, deleteNoteItem }) => {
  const { id } = useParams(); // Get the list ID from the URL
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [currentList, setCurrentList] = useState(null); // Initialize state for current list

  // Update currentList whenever noteItems changes or on initial load
  useEffect(() => {
    const foundList = noteItems.find(item => item.id === parseInt(id));
    setCurrentList(foundList);
  }, [noteItems, id]);

  const handleDelete = (itemId) => {
    if (!currentList) return; // Prevent errors if currentList is null
    const updatedItems = currentList.items.filter(item => item.id !== itemId);
    const updatedList = { ...currentList, items: updatedItems };
    setCurrentList(updatedList);
    updateNoteItem(updatedList); // Update parent state
  };

  const handleUpdate = (updatedItem) => {
    if (!currentList) return; // Prevent errors if currentList is null
    const updatedItems = currentList.items.map(item => item.id === updatedItem.id ? updatedItem : item);
    const updatedList = { ...currentList, items: updatedItems };
    setCurrentList(updatedList);
    updateNoteItem(updatedList); // Update parent state
  };

  const handleAddNewItem = () => {
    if (!currentList) return; // Prevent errors if currentList is null
    const newItemContent = prompt("Tuotenimi:"); // Prompt user for new item name
    if (!newItemContent) {
      alert("Tuotenimi ei voi olla tyhjä."); // Ensure input is valid
      return;
    }

    const newItem = {
      id: Date.now(), // Use current timestamp as unique ID
      content: newItemContent,
    };

    const updatedItems = [...currentList.items, newItem]; // Add new item to the list
    const updatedList = { ...currentList, items: updatedItems };
    setCurrentList(updatedList);
    updateNoteItem(updatedList); // Update parent state
  };

  const handleDeleteList = () => {
    if (window.confirm("Poistetaanko varmasti?")) {
      deleteNoteItem(currentList.id); // Call delete function from props
      navigate(-1); // Navigate back after deletion
    }
  };

  // Check if currentList is null and show a message or loading state
  if (!currentList) {
    return <div>List not found. Please check the URL or go back.</div>; // Custom message if list is not found
  }

  return (
    <div>
      <h1>Jaettu lista</h1>
      <button onClick={() => navigate(-1)}>Takaisin</button> 
      <h2>{currentList.content}</h2>
      <ul>
        {currentList.items && currentList.items.length > 0 ? ( // Ensure items exist before mapping
          currentList.items.map(item => (
            <ListItem 
              key={item.id} 
              item={item} 
              deleteNoteItem={handleDelete} 
            />
          ))
        ) : (
          <li>Ei vielä tuotteita</li> 
        )}
      </ul>
      <button onClick={handleAddNewItem}>Lisää tuote</button> {/* Button for adding new item */}
      <button onClick={handleDeleteList}>Poista lista</button> {/* Button for deleting list */}
    </div>
  );
};

export default ListView;
