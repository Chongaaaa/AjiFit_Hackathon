document.addEventListener("DOMContentLoaded", function() {
    // Function to handle file selection
    function handleFileSelect(event) {
        console.log("File selected");
        const file = event.target.files[0];
        
        // Check if a file is selected
        if (file) {
            // Update the post media with the selected photo path
            const postMedia = document.getElementById('post-media');
            postMedia.textContent = `Photo selected: ${file.name}`;
        }
    }

    // Add event listener to file input for photo upload
    document.getElementById('photo-upload').addEventListener('change', handleFileSelect);

    // Function to create a new card body for activity
    // Function to create a new card body for activity
    // Function to create a new card body for activity
    function createActivityCardBody(profileImgSrc, textContent, photoContentSrc) {
        const activityCardBody = document.createElement('div');
        activityCardBody.classList.add('card-body');

        const profileInfo = document.createElement('div');
        profileInfo.classList.add('card-title', 'text-white', 'd-flex', 'align-items-center');
        profileInfo.setAttribute('id', 'pfp');
        profileInfo.innerHTML = `
            <img src="${profileImgSrc}" id="pf_img" class="rounded-circle border border-1 fs-3" alt="...">
            <span class="fs-5 ms-2">Username | Public | <span style="font-size: 15px;">x hours ago</span></span>
        `;
        activityCardBody.appendChild(profileInfo);

        const postContent = document.createElement('div');
        postContent.classList.add('card-body');
        postContent.setAttribute('id', 'post');
        postContent.innerHTML = `
            <img src="${photoContentSrc}" id="photo-content" alt="">
        `;
        activityCardBody.appendChild(postContent);

        const actionContent = document.createElement('div');
        actionContent.classList.add('mt-1');
        actionContent.innerHTML = `
            <i class="bi bi-hand-thumbs-up-fill ms-3 fs-4" id="like-icon"></i>  
            <i class="bi bi-chat-fill ms-2 fs-4" id="cmt-icon"></i>
            <span class="ms-2 fs-4">${textContent}</span>
        `;
        activityCardBody.appendChild(actionContent);

        return activityCardBody;
    }



    // Function to handle publishing a new post
    function publishPost() {
        console.log("Publish button clicked");
        // Get the entered text and selected photo
        const textContent = document.getElementById('post-content').value.trim();
        const photoUpload = document.getElementById('photo-upload');
        
        // Check if both text and photo are provided
        if (textContent || (photoUpload.files.length > 0 && textContent)) {
            // Get the photo file
            const photoFile = photoUpload.files[0];
            
            // Create a new card body for the activity
            const activityCardBody = createActivityCardBody("/image/profile_img.webp", textContent, photoFile ? URL.createObjectURL(photoFile) : null);
            
            // Get the Activity section
            const activitySection = document.getElementById('Activity');
            
            // Insert the new card body at the top of the Activity section
            activitySection.insertBefore(activityCardBody, activitySection.firstChild);
            
            // Clear the post-content input and photo-upload input
            document.getElementById('post-content').value = '';
            photoUpload.value = null;
        } else {
            alert('Please enter text content and/or select a photo before publishing.');
        }
    }

    // Add event listener to the Publish button
    document.getElementById('pb-btn').addEventListener('click', publishPost);

    // Define variables to store the values for each progress bar
    let progressValue1 = 17;
    let progressValue2 = 30-progressValue1;

    // Function to update the progress bars
    function updateProgressBars() {
        // Calculate the width of each progress bar
        const width1 = (progressValue1 / 30) * 100;
        const width2 = (progressValue2 / 30) * 100;

        // Update the style and aria attributes of each progress bar
        document.querySelector('.progress-bar:first-of-type').style.width = `${width1}%`;
        document.querySelector('.progress-bar:first-of-type').setAttribute('aria-valuenow', progressValue1);

        document.querySelector('.progress-bar:last-of-type').style.width = `${width2}%`;
        document.querySelector('.progress-bar:last-of-type').setAttribute('aria-valuenow', progressValue2);
    }

    // Call the updateProgressBars function initially
    updateProgressBars();

    function rearrangeItems() {
        // Get the parent div containing all the items
        const lBoard = document.getElementById('l_board');

        // Get all the div elements with id starting with "item"
        const items = Array.from(lBoard.querySelectorAll('[id^="item"]'));

        // Store the original background colors
        const originalBackgroundColors = items.map(item => item.parentNode.style.backgroundColor);

        // Sort the items based on streak value
        items.sort((a, b) => {
            const streakA = parseInt(a.querySelector('#streak').innerText);
            const streakB = parseInt(b.querySelector('#streak').innerText);
            return streakB - streakA; // Sort in descending order
        });

        // Reorder the items within the parent div
        items.forEach((item, index) => {
            lBoard.appendChild(item.parentNode); // Append each item to the parent div
            item.id = 'item' + (index + 1); // Update the id to maintain the order
            item.querySelector('.col-2').innerText = index + 1; // Update the rank number
        });

        // Reapply the original background colors
        items.forEach((item, index) => {
            item.parentNode.style.backgroundColor = originalBackgroundColors[index];
        });
    }

    function updateStreakForUser(userName, newStreak) {
        // Find the element with the specified user name
        const userListItems = document.querySelectorAll('#l_board li');
        let userElement;
        userListItems.forEach(item => {
            const usernameElement = item.querySelector('[id="user-name"]');
            if (usernameElement && usernameElement.textContent.trim() === userName) {
                userElement = item;
            }
        });
    
        // Check if the user element exists
        if (userElement) {
            // Find the corresponding streak element
            const streakElement = userElement.querySelector('[id^="streak"]');
            
            // Update the streak value
            if (streakElement) {
                streakElement.textContent = newStreak;
            }
        } else {
            console.log(`User "${userName}" not found.`);
        }
    }

    // Example usage: Update the streak value for "Chyi keat" to 40
    updateStreakForUser("Chyi keat", 70);

    // Call the function to initially arrange the items
    rearrangeItems();


    
}); 
