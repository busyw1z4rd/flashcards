const storageKey = 'academicWords';
let academicWords = []; // This is where the words will be stored
let currentCardIndex = 0;
let shuffledIndices = [];

function init() {
  loadWordsFromStorage();
  shuffleArrays(academicWords);
  prepareShuffledArrays();
  updateCard();
}

function loadWordsFromStorage() {
  const storedWords = localStorage.getItem(storageKey);
  academicWords = storedWords ? JSON.parse(storedWords) : [];
}

function saveWordsToStorage(words) {
  localStorage.setItem(storageKey, JSON.stringify(words));
}

function shuffleArrays(array) {
  shuffledIndices = Array.from({ length: array.length }, (_, index) => index);

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
  }
}

function prepareShuffledArrays() {
  shuffledWords = shuffledIndices.map(index => academicWords[index].word);
  shuffledDefinitions = shuffledIndices.map(index => academicWords[index].definitions);
  shuffledExamples = shuffledIndices.map(index => academicWords[index].examples);
}

function updateCard() {
  const cardFront = document.querySelector('.card-front .front-text');
  const cardBack = document.querySelector('.card-back .back-text');
  const exampleText = document.querySelector('.card-back .example-text');

  if (Math.random() < 0.5) {
    cardFront.textContent = shuffledWords[currentCardIndex];
    cardBack.innerHTML = formatDefinitions(shuffledDefinitions[currentCardIndex]);
    exampleText.innerHTML = formatExamples(shuffledExamples[currentCardIndex]);
  } else {
    cardFront.textContent = shuffledDefinitions[currentCardIndex].join('\n');
    cardBack.textContent = shuffledWords[currentCardIndex];
    exampleText.innerHTML = formatExamples(shuffledExamples[currentCardIndex]);
  }
}

function formatDefinitions(definitions) {
  return definitions.map((def, index) => `${index + 1}. ${def}`).join('<br>');
}

function formatExamples(examples) {
  return examples.map(example => `Example: ${example}`).join('<br>');
}

function flipCard(card) {
  card.classList.toggle('flipped');
}

function nextCard() {
  const card = document.querySelector('.flashcard');
  card.classList.remove('flipped');

  currentCardIndex = (currentCardIndex + 1) % academicWords.length;
  updateCard();
}

function prevCard() {
  const card = document.querySelector('.flashcard');
  card.classList.remove('flipped');

  currentCardIndex = (currentCardIndex - 1 + academicWords.length) % academicWords.length;
  updateCard();
}

function addNewWord(event) {
  event.preventDefault();

  const wordInput = document.getElementById('wordInput').value.trim();
  const definitionInput = document.getElementById('definitionInput').value.trim();
  const exampleInput = document.getElementById('exampleInput').value.trim();

  if (!wordInput || !definitionInput || !exampleInput) {
    alert('All fields must be filled in.');
    return;
  }

  const newWord = {
    word: wordInput,
    definitions: definitionInput.split('\n').map(def => def.trim()),
    examples: exampleInput.split('\n').map(example => example.trim())
  };

  academicWords.push(newWord);
  saveWordsToStorage(academicWords);

  shuffleArrays(academicWords);
  prepareShuffledArrays();
  updateCard();

  // Clear input fields
  document.getElementById('wordInput').value = '';
  document.getElementById('definitionInput').value = '';
  document.getElementById('exampleInput').value = '';
}

document.addEventListener('DOMContentLoaded', init);
// ... (existing code)

const serverUrl = 'http://localhost:3000'; // Change this if your server runs on a different port or domain

function loadWordsFromServer() {
  fetch(`${serverUrl}/words`)
    .then(response => response.json())
    .then(words => {
      academicWords = words;
      shuffleArrays(academicWords);
      prepareShuffledArrays();
      updateCard();
    })
    .catch(error => console.error('Error loading words:', error));
}

function addNewWordToServer(newWord) {
  fetch(`${serverUrl}/words`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newWord),
  })
    .then(response => response.json())
    .then(response => console.log(response.message))
    .catch(error => console.error('Error adding word:', error));
}

document.addEventListener('DOMContentLoaded', () => {
  loadWordsFromServer();
  // Other initialization code
});

function addNewWord(event) {
  event.preventDefault();

  const wordInput = document.getElementById('wordInput').value.trim();
  const definitionInput = document.getElementById('definitionInput').value.trim();
  const exampleInput = document.getElementById('exampleInput').value.trim();

  if (!wordInput || !definitionInput || !exampleInput) {
    alert('All fields must be filled in.');
    return;
  }

  const newWord = {
    word: wordInput,
    definitions: definitionInput.split('\n').map(def => def.trim()),
    examples: exampleInput.split('\n').map(example => example.trim())
  };

  academicWords.push(newWord);
  saveWordsToStorage(academicWords);
  addNewWordToServer(newWord);

  shuffleArrays(academicWords);
  prepareShuffledArrays();
  updateCard();

  // Clear input fields
  document.getElementById('wordInput').value = '';
  document.getElementById('definitionInput').value = '';
  document.getElementById('exampleInput').value = '';
}

// ... (remaining code)
