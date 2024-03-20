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
    var count = 1;
    
    displayPosts();

    const userID = localStorage.getItem('userId');
    db.ref(userID).on('value', function(snapshot){
        const data = snapshot.val();
        const loginCount = data.loginCount;
        const name1 = data.name;
        const pfpImg = data.profileImg;

        setUserInfo(name1, pfpImg)
        setPfInfo(name1, pfpImg);
        updateStreakForUser(name1, loginCount);
        rearrangeItems(name1, pfpImg);

    });
    
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
    function createActivityCardBody(profileImgSrc, name, textContent, photoContentSrc) {
        
        const activityCardBody = document.createElement('div');
        activityCardBody.classList.add('card-body');
    
        const profileInfo = document.createElement('div');
        profileInfo.classList.add('card-title', 'text-white');
        profileInfo.setAttribute('id', 'pfp');
        profileInfo.innerHTML = `
            <img src="${profileImgSrc}" class="rounded-circle border border-1 fs-3" alt="...">
            <span class="fs-5"> ${name} | Public | <span style="font-size: 15px;">1 min ago</span></span>
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
            <span class="ms-2 fs-4" id="text-content">${textContent}</span>
        `;
        activityCardBody.appendChild(actionContent);
    
        // Add a horizontal line at the end of the card body
        const hr = document.createElement('hr');
        activityCardBody.appendChild(hr);
    
        return activityCardBody;
    }
    

    function setUserInfo(name, pfpImg) {
        document.getElementById('name2').textContent = 'Hello, ' + name;
        document.getElementById('pfpImg').src = pfpImg;
        document.getElementById('pfpImgP').src = pfpImg;

    }
    
    function setPfInfo(name, pfpImg) {
        document.getElementById('name1').textContent = name;
        document.getElementById('pfpImg').src = pfpImg;
    }
    
    // Function to handle publishing a new post
    // Define count outside of the functions

    function publishPost() {
        const userID = localStorage.getItem('userId');
        
        db.ref(userID).once('value', function(snapshot){
            const data = snapshot.val();
            const name1 = data.name;
            const pfpImg = data.profileImg;
    
            console.log("Publish button clicked");
            // Get the entered text and selected photo
            const textContent = document.getElementById('post-content').value.trim();
            const photoUpload = document.getElementById('photo-upload');
            
            // Check if both text and photo are provided
            if (textContent || (photoUpload.files.length > 0 && textContent)) {
                
                // Get the photo file and its filename
                const photoFile = photoUpload.files[0];
                const filename = photoFile.name;
                
                // Construct the image path with the filename
                const imagePath = `../image/${filename}`;
                alert(imagePath);
                
                // Create a new card body for the activity
                storePost(userID, textContent, imagePath);
                const activityCardBody = createActivityCardBody(pfpImg, name1, textContent, imagePath);
                
                // Get the Activity section
                const activitySection = document.getElementById('Activity');
                
                // Insert the new card body at the top of the Activity section
                activitySection.insertBefore(activityCardBody, activitySection.firstChild);
                
                // Clear the post-content input and photo-upload input
                document.getElementById('post-content').value = '';
                document.getElementById('post-media').textContent = '';
                photoUpload.value = null;
    
                // Store the post in the database
            } else {
                alert('Please enter text content and/or select a photo before publishing.');
            }
        });
    }
    

function storePost(userID, textContent, photoContent) {
    db.ref(userID  + '/Post/' + count ).set({
        textContent: textContent,
        photoContent: photoContent
    });
    count++;
}




    // Add event listener to the Publish button
    document.getElementById('pb-btn').addEventListener('click', publishPost);

    // Function to update the progress bars
    function updateProgressBars() {
        const userID = localStorage.getItem('userId');
        db.ref(userID).on('value', function(snapshot){
            const data = snapshot.val();
            const loginCount = data.loginCount;
    
            // Calculate the width of each progress bar
            if (loginCount > 100) {
                loginCount -= 100;
            }
            const width1 = (loginCount / 100) * 100;
            const width2 = ((100 - loginCount) / 100) * 100;
    
            // Update the style and aria attributes of each progress bar
            document.querySelector('.progress-bar:first-of-type').style.width = `${width1}%`;
            document.querySelector('.progress-bar:last-of-type').style.width = `${width2}%`;
    
            // Update the value of the 'daysToHund' span
            const days = loginCount > 0 ? loginCount : 0;
            const daysText = `${days} days out of 100 days ! `;
            document.getElementById('daysToHund').innerHTML = `${daysText} <i class="bi bi-fire text-warning fs-5"></i>`;
        });
    }
    

    // Call the updateProgressBars function initially
    updateProgressBars();

    function rearrangeItems(name1, pfpImg) {
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

        const userName1 = document.querySelector('#item1 [id="user-name"]').textContent.trim();
        const userName2 = document.querySelector('#item2 [id="user-name"]').textContent.trim();
        const userName3 = document.querySelector('#item3 [id="user-name"]').textContent.trim();
        if(userName1 === name1){
            chyiKeatRank = 1;
        } 
        else if(userName2 === name1){
            chyiKeatRank = 2;
        }
        else if(userName3 === name1){
            chyiKeatRank = 3;
        }
        else{
            chyiKeatRank = 4;
        }

        // Check if Chyi keat's rank is 1
        if (chyiKeatRank === 1) {
            // Change the profile picture source to the default source
            var profilePic = document.querySelector('#item1-pfp');
            profilePic.src = pfpImg;
            var profilePic = document.querySelector('#item2-pfp');
            profilePic.src = '/image/Amenda_pfp.jpg';
            var profilePic = document.querySelector('#item3-pfp');
            profilePic.src = '/image/Kobe_pfp.jpg';
        } 
        else if(chyiKeatRank === 2) {
            // Change the profile picture source to /image/baked-avocado-eggs-1.jpeg
            var profilePic = document.querySelector('#item1-pfp');
            profilePic.src = '/image/Amenda_pfp.jpg';
            var profilePic = document.querySelector('#item2-pfp');
            profilePic.src = pfpImg;
            var profilePic = document.querySelector('#item3-pfp');
            profilePic.src = '/image/Kobe_pfp.jpg';
        }
        else if(chyiKeatRank === 3) {
            // Change the profile picture source to /image/baked-avocado-eggs-1.jpeg
            var profilePic = document.querySelector('#item1-pfp');
            profilePic.src = '/image/Amenda_pfp.jpg';
            var profilePic = document.querySelector('#item2-pfp');
            profilePic.src = '/image/Kobe_pfp.jpg';
            var profilePic = document.querySelector('#item3-pfp');
            profilePic.src = pfpImg;
        }
        else{
            // Change the profile picture source to /image/baked-avocado-eggs-1.jpeg
            var profilePic = document.querySelector('#item1-pfp');
            profilePic.src = '/image/baked-avocado-eggs-1.jpeg';
            var profilePic = document.querySelector('#item2-pfp');
            profilePic.src = '/image/baked-avocado-eggs-1.jpeg';
            var profilePic = document.querySelector('#item3-pfp');
            profilePic.src = '/image/baked-avocado-eggs-1.jpeg';
        }
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
    

    // Call the function to initially arrange the items
    

    function displayPosts() {
        const userID = localStorage.getItem('userId');
        db.ref(userID + '/Post').once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                // Retrieve post data
                const postData = childSnapshot.val();
                const textContent = postData.textContent;
                const photoContent = postData.photoContent;
                db.ref(userID).once('value', function(snapshot){
                    const data = snapshot.val();
                    const name1 = data.name;
                
                    // Create card body for the post
                    const activityCardBody = createActivityCardBody(data.profileImg, name1, textContent, photoContent);
                    
                    // Get the Activity section and insert the new card body
                    const activitySection = document.getElementById('Activity');
                    activitySection.insertBefore(activityCardBody, activitySection.firstChild);
                });
            });
        });
    }    
}); 



// Logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  localStorage.clear();
  e.preventDefault();
  auth.signOut();
});
