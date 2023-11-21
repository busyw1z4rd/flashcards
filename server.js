const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Serve static files (including index.html) from the 'public' directory
app.use(express.static('public'));

app.get('/words', (req, res) => {
  const words = loadWords();
  res.json(words);
});

app.post('/words', (req, res) => {
  const newWord = req.body;
  const words = loadWords();
  words.push(newWord);
  saveWords(words);
  res.json({ message: 'Word added successfully' });
});

function loadWords() {
  try {
    const data = fs.readFileSync('words.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveWords(words) {
  const data = JSON.stringify(words, null, 2);
  fs.writeFileSync('words.json', data);
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
