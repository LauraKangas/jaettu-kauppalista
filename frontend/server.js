
const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');


admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://jaettu-kauppalista.firebaseio.com",
});

const db = admin.firestore();

const app = express();
app.use(bodyParser.json());

app.get('/api/lists', async (req, res) => {
  try {
    const listsSnapshot = await db.collection('lists').get();
    const lists = listsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(lists);
  } catch (error) {
    res.status(500).send('Error fetching lists');
  }
});

app.post('/api/lists', async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).send('List content is required');
  }

  try {
    const newListRef = await db.collection('lists').add({ content, items: [] });
    res.status(201).json({ id: newListRef.id, content });
  } catch (error) {
    res.status(500).send('Error creating list');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
