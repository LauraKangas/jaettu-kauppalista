const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.getLists = functions.https.onRequest(async (req, res) => {
  try {
    const listsSnapshot = await db.collection('lists').get();
    const lists = listsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(lists);
  } catch (error) {
    console.error('Error fetching lists:', error);
    res.status(500).json({ message: 'Error fetching lists' });
  }
});

exports.createList = functions.https.onRequest(async (req, res) => {
  try {
    const { content } = req.body; 
    if (!content) {
      return res.status(400).json({ message: 'List content is required' });
    }
    
    const newList = {
      content,
      items: [],
    };

    const docRef = await db.collection('lists').add(newList);
    res.status(201).json({ id: docRef.id, ...newList });
  } catch (error) {
    console.error('Error creating list:', error);
    res.status(500).json({ message: 'Error creating list' });
  }
});

exports.deleteList = functions.https.onRequest(async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection('lists').doc(id).delete();
    res.status(200).json({ message: 'List deleted successfully' });
  } catch (error) {
    console.error('Error deleting list:', error);
    res.status(500).json({ message: 'Error deleting list' });
  }
});

exports.updateList = functions.https.onRequest(async (req, res) => {
  const { id } = req.params;
  const { items } = req.body; 
  try {
    const listRef = db.collection('lists').doc(id);
    await listRef.update({ items });
    res.status(200).json({ message: 'List updated successfully' });
  } catch (error) {
    console.error('Error updating list:', error);
    res.status(500).json({ message: 'Error updating list' });
  }
});
