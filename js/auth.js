// Authentication Module
// Handles login, signup, and session management

class AuthManager {
  constructor() {
    this.auth = null;
    this.database = null;
    this.currentUser = null;
  }

  // Initialize with Firebase instances
  init() {
    const { auth, database } = getFirebaseInstances();
    this.auth = auth;
    this.database = database;
    
    // Listen for auth state changes
    this.auth.onAuthStateChanged((user) => {
      this.currentUser = user;
      if (user) {
        console.log('✅ User authenticated:', user.email);
        this.loadUserData(user.uid);
      } else {
        console.log('ℹ️ No user authenticated');
      }
    });
  }

  // Signup with email, password, name, and mobile
  async signup(email, password, name, mobile) {
    try {
      // Validate inputs
      if (!email || !password || !name || !mobile) {
        throw new Error('All fields are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Create user account
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Update profile with display name
      await user.updateProfile({
        displayName: name
      });

      // Save additional user data to database
      await this.database.ref(`users/${user.uid}`).set({
        name: name,
        email: email,
        mobile: mobile,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      });

      console.log('✅ User registered successfully');
      return { success: true, user };
    } catch (error) {
      console.error('❌ Signup error:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  // Login with email and password
  async login(email, password) {
    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Sign in user
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      console.log('✅ User logged in successfully');
      return { success: true, user };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  // Logout
  async logout() {
    try {
      await this.auth.signOut();
      this.currentUser = null;
      console.log('✅ User logged out successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Logout error:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  // Load user data from database
  async loadUserData(userId) {
    try {
      const snapshot = await this.database.ref(`users/${userId}`).once('value');
      const userData = snapshot.val();
      
      if (userData) {
        // Store in sessionStorage for quick access
        sessionStorage.setItem('userData', JSON.stringify(userData));
        return userData;
      }
      return null;
    } catch (error) {
      console.error('❌ Error loading user data:', error);
      return null;
    }
  }

  // Get current user data (async with fetch fallback)
  async getUserProfile() {
    // 1. Try session storage first
    const stored = sessionStorage.getItem('userData');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // 2. If not in storage but user is logged in, fetch from DB
    if (this.currentUser) {
      console.log('🔄 User data not in storage, fetching from DB...');
      return await this.loadUserData(this.currentUser.uid);
    }
    
    // 3. Wait a bit if auth is initializing (fallback for race conditions)
    if (!this.currentUser) {
        // Simple retry logic could go here, or just return null
        return null; 
    }

    return null;
  }

  // Get user data synchronously (deprecated for profile loading)
  getUserData() {
    const stored = sessionStorage.getItem('userData');
    return stored ? JSON.parse(stored) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Get user-friendly error messages
  getErrorMessage(error) {
    const errorMessages = {
      'auth/email-already-in-use': 'This email is already registered',
      'auth/invalid-email': 'Invalid email address',
      'auth/operation-not-allowed': 'Operation not allowed',
      'auth/weak-password': 'Password is too weak',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later',
      'auth/network-request-failed': 'Network error. Please check your connection'
    };

    return errorMessages[error.code] || error.message || 'An error occurred';
  }

  // Redirect to dashboard if authenticated
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  }

  // Redirect to dashboard if already authenticated
  redirectIfAuthenticated() {
    if (this.isAuthenticated()) {
      window.location.href = 'dashboard.html';
      return true;
    }
    return false;
  }
}

// Create global instance
const authManager = new AuthManager();

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.authManager = authManager;
}
