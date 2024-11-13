import { db } from '../../utils/firebase/app'; 
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';

export const createList = async (userPin, listName, listItems) => {
  try {
    const listRef = collection(db, 'users', userPin, 'lists');
    
    const newList = {
      name: listName,
      items: listItems, 
      createdAt: new Date(),
    };

    const docRef = await addDoc(listRef, newList);

    return docRef.id;
  } catch (error) {
    console.error("Error creating list: ", error);
    throw new Error("Failed to create list");
  }
};
