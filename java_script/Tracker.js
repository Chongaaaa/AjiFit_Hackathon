document.addEventListener("DOMContentLoaded", function() {
    var caloriesPDay = document.getElementById("cpd-bar");
    var alertShown = false; // Variable to track whether alert has been shown
  
    function handleInput() {
        // Get the value entered by the user
        var userInput = caloriesPDay.value.trim();
        
        // Check if the input is a valid number
        if (!isNaN(userInput) && userInput !== "") {
            // Input is a valid number
            console.log("Valid numeric input: " + userInput);
            
            // Set CSS variable with the value of CaloriesPDay
            document.documentElement.style.setProperty('--caloriesPDay', userInput);
  
            if (userInput < 1500) {
                // If smaller than 1500, fully fill the path
                document.querySelector("path.purple").style.strokeDashoffset = "0";
            } else {
                // If greater than or equal to 1500, calculate the dash offset
                document.querySelector("path.purple").style.strokeDashoffset = calc(40 * 3.142 * 1.85 - (1500 / var(--caloriesPDay)) * (40 * 3.142 * 1.85));
            }
  
            document.getElementById("clr-text").textContent = 1500 / ${userInput} kCal;
  
            // Reset alertShown variable
            alertShown = false;
        }else{
            // Input is not a valid number
            if (!alertShown) {
                // If alert has not been shown yet, show the alert
                alert("Please enter a valid numeric value.");
                alertShown = true; // Set alertShown to true
            }
            caloriesPDay.value = ""; // Clear the input field
            caloriesPDay.focus(); // Focus back on the input field
        }
    }
  
    // Add event listener for the blur event
    caloriesPDay.addEventListener("blur", handleInput);
  
    // Add event listener for keydown event
    caloriesPDay.addEventListener("keydown", function(event) {
        // Check if the pressed key is space (keyCode 32) or enter (keyCode 13)
        if (event.keyCode === 13) {
            // Call the function to handle input
            handleInput();
        }
    });
    
    // Add an event listener to the "Save" button
    document.getElementById('new-record').addEventListener('click', function() {
      // Get input values
      var caloriesInput = document.getElementById('clr-in');
      var carbInput = document.getElementById('carb-in');
      var proteinInput = document.getElementById('prt-in');
      var fatInput = document.getElementById('fat-in');
      var mealTypeInput = document.querySelector('input[name="flexRadioDefault"]:checked');
      var dateInput = document.getElementById('date-slt');
      var timeInput = document.getElementById('time-slt');
      var foodDesc = document.getElementById('food-desc');
  
      // Validate inputs (check if they are numeric)
      var caloriesValue = parseFloat(caloriesInput.value);
      var carbValue = parseFloat(carbInput.value);
      var proteinValue = parseFloat(proteinInput.value);
      var fatValue = parseFloat(fatInput.value);
  
      // Flag to track if any input is invalid or empty
      var invalidInput = false;
  
      // Check if inputs are numeric and not empty
      if (isNaN(caloriesValue) || caloriesInput.value.trim() === '') {
          caloriesInput.value = '';
          caloriesInput.focus();
          invalidInput = true;
      } else if (isNaN(carbValue) || carbInput.value.trim() === '') {
          carbInput.value = '';
          carbInput.focus();
          invalidInput = true;
      } else if (isNaN(proteinValue) || proteinInput.value.trim() === '') {
          proteinInput.value = '';
          proteinInput.focus();
          invalidInput = true;
      } else if (isNaN(fatValue) || fatInput.value.trim() === '') {
          fatInput.value = '';
          fatInput.focus();
          invalidInput = true;
      } else if (!mealTypeInput) {
          alert("Please select a meal type.");
          invalidInput = true;
      } else if (!dateInput.value) {
          alert("Please select a date.");
          invalidInput = true;
      } else if (!timeInput.value) {
          alert("Please select a time.");
          invalidInput = true;
      }
  
      // Display alert only if there are invalid inputs
      if (invalidInput) {
          alert("Please enter valid values for all fields.");
      } else {
          // If all inputs are valid, proceed with saving the record
          var mealType = mealTypeInput.value;
          var date = dateInput.value;
          var time = timeInput.value;
  
          // Check if the date matches today's date
          var today = new Date();
          var dd = String(today.getDate()).padStart(2, '0');
          var mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
          var yyyy = today.getFullYear();
          var formattedToday = yyyy + '-' + mm + '-' + dd;
  
          if (date === formattedToday) {
              // If the date matches today's date, proceed with sum calculation
              var carbSum = parseFloat(document.getElementById('carb-out').value);
              var proteinSum = parseFloat(document.getElementById('prt-out').value);
              var fatSum = parseFloat(document.getElementById('fat-out').value);
  
              carbSum += carbValue;
              proteinSum += proteinValue;
              fatSum += fatValue;
  
              // Update the totals
              document.getElementById('carb-out').value = carbSum;
              document.getElementById('prt-out').value = proteinSum;
              document.getElementById('fat-out').value = fatSum;
          }
  
          // Display values in console
          console.log("Meal Type: " + mealType);
          console.log("Date: " + date);
          console.log("Time: " + time);
          console.log("Calories: " + caloriesValue + " kCal");
          console.log("Carbohydrate: " + carbValue + " g");
          console.log("Protein: " + proteinValue + " g");
          console.log("Fat: " + fatValue + " g");
          console.log("Food Description: " + foodDesc.value);
  
          // Close the modal
          var modal = document.getElementById('tracker');
          var modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
      }
  });
  
  });