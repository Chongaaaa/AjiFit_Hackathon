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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
// Reference 
const database = firebase.database();

// sign-up
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("signupForm").addEventListener("submit", submitForm);
});

function submitForm(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("emailid").value;
  const password = document.getElementById("password").value;
  const repassword = document.getElementById("repassword").value;

  if (password !== repassword) {
    alert("Passwords do not match. Please re-enter.");
    document.getElementById("password").value = "";
    document.getElementById("repassword").value = "";
    return;
  }

  // Sign up the user
  auth.createUserWithEmailAndPassword(email, password)
    .then(cred => {
      // Save user data to the database
      const userId = cred.user.uid; // Use Firebase UID
      
      saveUserData(userId, name, email, password, 0); // Initialize login count to 0

      // Alert success message
      alert("Sign up successful!");

      // Close the signup modal & reset form
      document.getElementById("signupForm").reset();
      window.location.href = "login.html";
    })
    .catch(error => {
      alert("Signup failed: " + error.message);
    });
}


//save user data to the database
function saveUserData(userId, name, email, password, loginCount) {
  database.ref(userId).set({
    name: name,
    email: email,
    password: password,
    loginCount: loginCount, // Save the login count
    membership : 'none',
    age : 0,
    height : 0,
    weight : 0,
    gender : 'Male/Female',
    profileImg : "none"
  });
}



auth.onAuthStateChanged(user => {
  if (user) {
    // Get the user ID
    var userId = user.uid;
    
    // Retrieve the current login count for the user
    database.ref(userId).once('value').then(snapshot => {
      var userData = snapshot.val();
      var loginCount = userData ? (userData.loginCount || 0) : 0;
      
      // Increment the login count
      loginCount++;
      
      // Update the login count in the database
      saveUserData(userId, user.displayName, user.email, user.password, loginCount);
    });
    
    // Redirect to menu.html after successful login
    localStorage.setItem('userId', userId);
    localStorage.setItem('userEmail', user.email);

    console.log('User logged in:', user);
  } else {
    console.log('User logged out');
  }
});

// login
document.addEventListener("DOMContentLoaded", function() {
  const loginForm = document.querySelector('#loginForm');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get user info
    const email = loginForm['email'].value;
    const password = loginForm['password'].value;

    // Log the user in
    auth.signInWithEmailAndPassword(email, password)
      .then((cred) => {
        // Reset form
        loginForm.reset();
        // Alert success message
        alert("Login successful!");

        // localStorage.setItem('userEmail', user.email);
        window.location.href = "index.html";
      })
      .catch(error => {
        // Handle authentication errors
        if (error.code === 'auth/user-not-found') {
          alert("User not found. Please check your credentials.");
        } else if (error.code === 'auth/wrong-password') {
          alert("Incorrect password. Please try again.");
        } else {
          alert("Redirecting you to the menu page...");
          
          localStorage.setItem('userEmail', user.email);
          window.location.href = "index.html";
        }
      });
  });
});

// Logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  localStorage.clear();
  e.preventDefault();
  auth.signOut();
});