document.addEventListener("DOMContentLoaded", function() {

    //----- FIREBASE -----
            // Initialize Firebase
            const firebaseConfig = {
                apiKey: "AIzaSyBROf8x8AaOQmWY5z1vb0icjOkWoDha6zo",
                authDomain: "useruser-5f5dc.firebaseapp.com",
                databaseURL: "https://useruser-5f5dc-default-rtdb.firebaseio.com",
                projectId: "useruser-5f5dc",
                storageBucket: "useruser-5f5dc.appspot.com",
                messagingSenderId: "294580009654",
                appId: "1:294580009654:web:a0ca0ae3dbaedd53704417",
                measurementId: "G-BZTH9RR80E"
            };

            firebase.initializeApp(firebaseConfig);

            const db = firebase.database();

    var caloriesPDay = document.getElementById("cpd-bar");
    var alertShown = false; // Variable to track whether alert has been shown
    var caloriesSum = 0;
    var count = 1;
  
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
      caloriesSum += caloriesValue;
  
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
              document.getElementById("clr-text").textContent = `${caloriesSum} / ${caloriesPDay.value} kCal`; // Here we should use userInput instead of undefined userInput variable
              document.getElementById('carb-out').value = carbSum;
              document.getElementById('prt-out').value = proteinSum;
              document.getElementById('fat-out').value = fatSum;
          }
          
          // Close the modal
          var modal = document.getElementById('tracker');
          var modalInstance = bootstrap.Modal.getInstance(modal);
          handleInput();
          modalInstance.hide();

          const userID = localStorage.getItem('userId');
            
          db.ref(userID  + '/Record/' + count ).set({
            mealType: mealType,
            Date: date,
            Time: time,
            Calories: caloriesValue,
            carborhydrate: carbValue,
            protein: proteinValue,
            fat: fatValue,
            foodDesc: foodDesc.value

            });

            showRecord(userID, count);
            count++;
      }
  });
  function handleInput() {
    // Get the value entered by the user
    var userInput = caloriesPDay.value.trim();
    
    // Check if the input is a valid number
    if (!isNaN(userInput) && userInput !== "") {
        // Input is a valid number
        console.log("Valid numeric input: " + userInput);
        
        // Set CSS variable with the value of CaloriesPDay
        document.documentElement.style.setProperty('--caloriesPDay', userInput);
        document.documentElement.style.setProperty('--Sum', caloriesSum);

        if (caloriesSum < userInput) {
            document.querySelector("path.purple").style.stroke = "#8DB4B9";
            // If greater than or equal to 1500, calculate the dash offset
            document.querySelector("path.purple").style.strokeDashoffset = `calc(40 * 3.142 * 1.85 - (var(--Sum) / var(--caloriesPDay)) * (40 * 3.142 * 1.85))`;
            document.getElementById("clr-text").textContent = `${caloriesSum} / ${caloriesPDay.value} kCal`;
        } else {
            // If smaller than 1500, fully fill the path
            document.querySelector("path.purple").style.strokeDashoffset = "0";
            document.querySelector("path.purple").style.stroke = "red";
        }

        // Reset alertShown variable
        alertShown = false;
    } else {
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
function showRecord(userID, count) {
    const recordContainer = document.getElementById('record-container');

    db.ref(userID + '/Record/' + count).on('value', function(snapshot) {
        const data = snapshot.val();
        const date = data.Date;
        const mealType = data.mealType;
        const foodDesc = data.foodDesc;
        const time = data.Time;
        const calories = data.Calories;

        // Check if a record with the same date exists
        let existingRecord = document.getElementById(`record-${date}`);
        if (!existingRecord) {
            // If no record with the same date exists, create a new one
            existingRecord = document.createElement('div');
            existingRecord.id = `record-${date}`;
            existingRecord.classList.add('col-12', 'justify-content-start', 'mb-1');

            // Add date section
            const dateSection = document.createElement('div');
            dateSection.classList.add('d-flex', 'w-100', 'justify-content-start', 'mt-1', 'ms-1');
            const dateHeading = document.createElement('h5');
            dateHeading.classList.add('mb-1');
            dateHeading.textContent = date;
            dateSection.appendChild(dateHeading);
            const calendarIcon = document.createElement('span');
            calendarIcon.classList.add('ms-3');
            calendarIcon.innerHTML = '<i class="bi bi-calendar"></i>';
            dateSection.appendChild(calendarIcon);
            existingRecord.appendChild(dateSection);

            recordContainer.prepend(existingRecord); // Insert the new record on top
        }

        // Add meal details to the existing record
        const mealContainer = document.createElement('div');
        mealContainer.classList.add('container', 'mb-2');
        mealContainer.style.backgroundColor = '#B2C5D3';
        const mealRow = document.createElement('div');
        mealRow.classList.add('row', 'justify-content-start', 'my-1');
        mealContainer.appendChild(mealRow);
        const mealIcon = document.createElement('i');
        mealIcon.classList.add('col-1', 'bi', 'bi-calendar', 'pt-4');
        mealRow.appendChild(mealIcon);
        const mealTextContainer = document.createElement('div');
        mealTextContainer.classList.add('col-5', 'text-start', 'py-2', 'ps-4');
        const mealTypeSpan = document.createElement('span');
        mealTypeSpan.classList.add('fs-5');
        mealTypeSpan.textContent = mealType;
        mealTextContainer.appendChild(mealTypeSpan);
        const foodDescHeading = document.createElement('h6');
        foodDescHeading.classList.add('text-muted');
        foodDescHeading.textContent = foodDesc;
        mealTextContainer.appendChild(foodDescHeading);
        mealRow.appendChild(mealTextContainer);
        const timeColumn = document.createElement('div');
        timeColumn.classList.add('col-3', 'py-2', 'text-end');
        const timeSpan = document.createElement('span');
        timeSpan.classList.add('fs-5');
        timeSpan.textContent = "Time: " + time;
        timeColumn.appendChild(timeSpan);
        mealRow.appendChild(timeColumn);
        const caloriesColumn = document.createElement('div');
        caloriesColumn.classList.add('col-3', 'py-2', 'text-end');
        const caloriesSpan = document.createElement('span');
        caloriesSpan.classList.add('fs-5');
        caloriesSpan.textContent = `${calories} kCal`;
        caloriesColumn.appendChild(caloriesSpan);
        mealRow.appendChild(caloriesColumn);

        existingRecord.appendChild(mealContainer);


        existingRecord.appendChild(exerciseContainer);
    });
}






});
