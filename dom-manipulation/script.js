// Array of quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "Put your worries in a torn pocket", category: "Life" },
  { text: "Follow your dreams ....unless they involve work", category: "Inspirational" },
  { text: "Whatever you do , give 100% unless you are donating blood !!", category: "Motivational" },
];

// Function to save the quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
  const randNumber = Math.floor(Math.random() * quotes.length);
  const randQuote = quotes[randNumber];

  document.getElementById("quoteDisplay").innerHTML =
    `<p><strong>Quote:</strong> ${randQuote.text}</p>
     <p><strong>Category:</strong> ${randQuote.category}</p>`;
  // Saving the last viewed quote to session storage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(randQuote));
}

// Function to add new quotes
function createAddQuoteForm() {
  const newQuote = document.getElementById('newQuoteText').value;
  const quoteCategory = document.getElementById('newQuoteCategory').value;

  // Check if both fields are filled in
  if (!newQuote || !quoteCategory) {
    alert("Please enter both the text and the category it falls under!");
    return;
  }

  // Push the new quote to the array
  quotes.push({ text: newQuote, category: quoteCategory });

  // Saving updated array to local storage
  saveQuotes();
  // Update the category filter dropdown
  populateCategories();
  // Creation of new DOM elements for quotes
  const quoteDiv = document.createElement('div');
  const quoteParagraph = document.createElement('p');
  const quoteCategoryElement = document.createElement('p');

  // Setting the content of the new elements
  quoteParagraph.innerHTML = `<strong>Quote:</strong> ${newQuote}`;
  quoteCategoryElement.innerHTML = `<strong>Category:</strong> ${quoteCategory}`;

  // Appending the new elements to the div
  quoteDiv.appendChild(quoteParagraph);
  quoteDiv.appendChild(quoteCategoryElement);

  // Make the quotes to display
  document.getElementById('quoteDisplay').appendChild(quoteDiv);
  // Clear the input fields
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';

  // Inform the user
  alert('Quote added successfully!');

  displayAllQuotes();
}

// Function to populate categories dynamically
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = new Set(quotes.map(quote => quote.category)); // Unique categories
  categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset dropdown to initial state

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // If a category was previously selected, restore the selection
  const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
  if (lastSelectedCategory) {
    categoryFilter.value = lastSelectedCategory;
    filterQuotes(); // Apply the filter
  }
}

// Function to filter and display quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;

  // Save the selected category to local storage for persistence
  localStorage.setItem('lastSelectedCategory', selectedCategory);

  const filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(quote => quote.category === selectedCategory);

  displayQuotes(filteredQuotes);
}

// Function to display all quotes
function displayAllQuotes() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = ""; // Clear previous content

  quotes.forEach(quote => {
    const quoteDiv = document.createElement('div');
    quoteDiv.innerHTML = `<p><strong>Quote:</strong> ${quote.text}</p>
                          <p><strong>Category:</strong> ${quote.category}</p>`;
    quoteDisplay.appendChild(quoteDiv);
  });
}

// Function to display the last viewed quote by user
function LastViewed() {
  const lastViewed = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
  if (lastViewed) {
    document.getElementById("quoteDisplay").innerHTML =
      `<p><strong>Quote:</strong> ${lastViewed.text}</p>
       <p><strong>Category:</strong> ${lastViewed.category}</p>`;
  }
}

// Function to export quotes to a JSON file
function exportQuotes() {
  const quotesBlob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const quotesUrl = URL.createObjectURL(quotesBlob);
  const downloadLink = document.createElement('a');
  downloadLink.href = quotesUrl;
  downloadLink.download = 'quotes.json';
  downloadLink.click();
  URL.revokeObjectURL(quotesUrl);

  // Inform the user
  alert('Quotes exported successfully!');
}

// Function to allow users to upload a JSON file containing quotes
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to sync quotes with the server
async function syncQuotesWithServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const serverQuotes = await response.json();

    // Merge server quotes with local quotes
    const mergedQuotes = [...quotes, ...serverQuotes];
    const uniqueQuotes = Array.from(new Set(mergedQuotes.map(quote => quote.text)))
      .map(text => mergedQuotes.find(quote => quote.text === text));

    quotes = uniqueQuotes;
    saveQuotes();
    displayAllQuotes();
    alert('Quotes synced with server successfully!');
  } catch (error) {
    console.error('Error syncing quotes with server:', error);
  }
}

// Initialize the application when the document is ready
document.addEventListener('DOMContentLoaded', () => {
  // Add event listener for showing a random quote
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  populateCategories();
  displayAllQuotes();
  LastViewed();

  // Sync quotes with the server periodically
  setInterval(syncQuotesWithServer, 60000); // Sync every 60 seconds
});