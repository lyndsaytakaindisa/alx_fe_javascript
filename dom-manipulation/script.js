// Array of quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "Put your worries in a torn pocket", category: "Life" },
  { text: "Follow your dreams ....unless they involve work", category: "Inspirational" },
  { text: "Whatever you do , give 100% unless you are donating blood !!", category: "Motivational" },
];
//function to save the quotes to localstorage
function saveQuotes(){
  localStorage.setItem('quotes',JSON.stringify(quotes));
}
// Function to display a random quote
function showRandomQuote() {
  const randNumber = Math.floor(Math.random() * quotes.length);
  const randQuote = quotes[randNumber];

  document.getElementById("quoteDisplay").innerHTML =
    `<p><strong>Quote:</strong> ${randQuote.text}</p>
     <p><strong>Category:</strong> ${randQuote.category}</p>`;
//saving the last viewed quote to session storage
sessionStorage.setItem('lastViewedQuote' ,JSON.stringify(randQuote));
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

  //saving updated array to local strorage
  saveQuotes();
  //creation of new DOM elements for quotes
  const quoteDiv = document.createElement('div');
  const quoteParagraph = document.createElement('p');
  const quoteCategoryElement = document.createElement('p');

  //setting the content of the new elements
  quoteParagraph.innerHTML =`<strong>Quote:</strong> ${newQuote}`;
  quoteCategoryElement.innerHTML = `<strong>Category:</strong> ${quoteCategory}`;

  //appending the new elements to the div
  quoteDiv.appendChild(quoteParagraph);
  quoteDiv.appendChild(quoteCategoryElement);

  //make the quotes to Display
  document.getElementById('quoteDisplay').appendChild(quoteDiv);
  // Clear the input fields
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';

  // Inform the user
  alert('Quote added successfully!');
}

//function to load all the quotes when initialized
function displayAllQuotes(){
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = ""; // Clear previous content

  quotes.forEach(quote => {
      const quoteDiv = document.createElement('div');
      quoteDiv.innerHTML = `<p><strong>Quote:</strong> ${quote.text}</p>
                            <p><strong>Category:</strong> ${quote.category}</p>`;
      quoteDisplay.appendChild(quoteDiv);
  });
}

//function to display the last viewed quote by user
function LastViewed(){
  const lastviewed = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
  if(lastviewed){
    document.getElementById("quoteDisplay").innerHTML =
          `<p><strong>Quote:</strong> ${lastviewed.text}</p>
           <p><strong>Category:</strong> ${lastviewed.category}</p>`
  }
}

//function to export quotes to a JSON file
function exportQuotes(){
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

//function to allow users to upload a JSON file containing quotes. Read the file and update the quotes array and local storage accordingly.
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

// Initialize the application when the document is ready
document.addEventListener('DOMContentLoaded', () => {
  // Add event listener for showing a random quote
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
 
  displayAllQuotes();
  LastViewed();
});