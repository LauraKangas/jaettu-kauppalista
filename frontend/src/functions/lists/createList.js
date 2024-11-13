import { db } from '../../utils/firebase/app'; // Firebase config
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';

// Function to create a new list under the user's pin
export const createList = async (userPin, listName, listItems) => {
  try {
    // Reference to the user's list collection under their pin
    const listRef = collection(db, 'users', userPin, 'lists');
    
    // Create a new list document under the user's pin
    const newList = {
      name: listName,
      items: listItems, // List items should be an array
      createdAt: new Date(),
    };

    // Add the new list to Firestore
    const docRef = await addDoc(listRef, newList);

    // Return the ID of the newly created list
    return docRef.id;
  } catch (error) {
    console.error("Error creating list: ", error);
    throw new Error("Failed to create list");
  }
};
