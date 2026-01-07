// Firebase Initialization Module
// Import Firebase SDK from CDN (loaded in HTML)

let app, auth, database;

// Initialize Firebase
function initializeFirebase() {
  try {
    // Initialize Firebase App
    app = firebase.initializeApp(firebaseConfig);
    
    // Initialize Firebase Authentication
    auth = firebase.auth();
    
    // Initialize Firebase Realtime Database
    database = firebase.database();
    
    console.log('✅ Firebase initialized successfully');
    return { app, auth, database };
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    throw error;
  }
}

// Get Firebase instances
function getFirebaseInstances() {
  if (!app || !auth || !database) {
    return initializeFirebase();
  }
  return { app, auth, database };
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.firebaseApp = app;
  window.firebaseAuth = auth;
  window.firebaseDatabase = database;
  window.initializeFirebase = initializeFirebase;
  window.getFirebaseInstances = getFirebaseInstances;
}
