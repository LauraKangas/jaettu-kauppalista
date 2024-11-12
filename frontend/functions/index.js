const functions = require('firebase-functions');
const express = require('express');

const app = express();

// Sample route
app.get('/', (req, res) => {
  res.send("Hello from Firebase Functions!");
});

// Export the express app as a Firebase Function
exports.api = functions.https.onRequest(app);

