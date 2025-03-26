const expressionField = document.querySelector(".expression");
const resultField = document.querySelector(".result");
let expression = ''; // To hold the current mathematical expression
let isCalculated = false; // To track if a result was just calculated


// Function to handle input values -> numbers, operators and '.'
const handleInput = (input) => {
  if(expression.length === 0 && isOperator(input)){
    return;
  }
  
  if (isCalculated && (!isNaN(input) || input === '.')) { // If result was just calculated and number clicked
    expression = ''; // Clear expression to start a new one
    resultField.textContent = '';
  }
  else if ((isCalculated) && isOperator(input)) { // If result was calculated and an operator is clicked
    expression = resultField.textContent; // Use the result as the starting point
    expressionField.textContent = expression;
  }

  isCalculated = false; // Reset the flag for future inputs

  // Append input to the expression
  expression += input;
  expressionField.textContent = expression; // Update the display
};

// Function to check if the input is an operator
const isOperator = (input) => {
  return ['+', '-', 'x', '/', '÷', '%'].includes(input); // Define the valid operators
};   

// Function to clear the calculator (AC)
const clearAll = () => {
  expression = '';
  expressionField.textContent = '';
  resultField.textContent = '';
  isCalculated = false;
};

// Function to clear the last entry (C)
const clearLast = () => {
  if (isCalculated){
    return;
  }
  if (expression.length > 0) {
    expression = expression.slice(0, -1); // Remove the last character
    expressionField.textContent = expression; // Update the display
  }
};

// Function to evaluate the result
const calculateResult = () => {
  try {
    // Evaluate the expression safely
    console.log(`${expression}`)
    const result = eval(expression.replace('x', '*').replace('÷', '/'));
    resultField.textContent = result; // Display result
    isCalculated = true; // Flag that result was just calculated
  } catch (error) {
    resultField.textContent = 'Error'; // Handle invalid expressions
  }
};

// Add event listeners to all calculator buttons
const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.textContent;
    console.log(value);

    if (button.classList.contains('number')) {
      handleInput(value); // Handle number input
    } 
    else if (button.classList.contains('operator')) {
      handleInput(`${value}`); // Handle operator input with spaces
    } 
    else if (button.classList.contains('function')) {
      if (value === 'AC') 
        clearAll(); // Clear all (AC)
      else if (value === 'C') 
        clearLast(); // Clear last entry (C)
      else if (value === '%') 
        handleInput('/100'); // Handle percentage input
      else if (value === '.')
         handleInput('.'); // Handle decimal input
    } 
    else if (button.classList.contains('equal')) {
      calculateResult(); // Handle equal button for evaluation
    }
  });
});
