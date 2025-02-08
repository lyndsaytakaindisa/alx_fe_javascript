// Array of quotes
let quotes = [
    { text: "Put your worries in a torn pocket", category: "Life" },
    { text: "Follow your dreams ....unless they involve work", category: "Inspirational" },
    { text: "Whatever you do , give 100% unless you are donating blood !!", category: "Motivational" },
  ];
  
  // Function to display a random quote
  function showRandomQuote() {
    const randNumber = Math.floor(Math.random() * quotes.length);
    const randQuote = quotes[randNumber];
  
    document.getElementById("quoteDisplay").innerHTML = 
      `<p><strong>Quote:</strong> ${randQuote.text}</p>
       <p><strong>Category:</strong> ${randQuote.category}</p>`;
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
  
    // Clear the input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  
    // Inform the user
    alert('Quote added successfully!');
  }
  
  // Initialize the application when the document is ready
  document.addEventListener('DOMContentLoaded', () => {
    // Add event listener for showing a random quote
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  });
  