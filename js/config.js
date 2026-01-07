// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgig1OyHWd1fSUODxA4_lLKhqGTvd0j7M",
  authDomain: "micro-plastic-abbf1.firebaseapp.com",
  databaseURL: "https://micro-plastic-abbf1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "micro-plastic-abbf1",
  storageBucket: "micro-plastic-abbf1.firebasestorage.app",
  messagingSenderId: "266395525306",
  appId: "1:266395525306:web:1188839db263a287eb2283",
  measurementId: "G-Q4MPB2FMD5"
};

// Gemini AI Configuration
const geminiConfig = {
  apiKey: "AIzaSyC-JV2VmqKQt9cp4-gy5wDiho6uI5rhLnw",
  endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
};

// Application Constants
const APP_CONSTANTS = {
  DETECTION_TYPES: {
    BLOOD: 'blood',
    WATER: 'water'
  },
  RISK_LEVELS: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
  },
  SCAN_DURATION: 7000, // 7 seconds
  FIREBASE_PATHS: {
    USERS: 'users',
    DETECTIONS: 'detections',
    SENSOR_DATA: 'SensorData',
    BLOOD_DETECTION: 'SensorData/BloodDetection',
    WATER_DETECTION: 'SensorData/WaterDetection'
  }
};

// Export configurations
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { firebaseConfig, geminiConfig, APP_CONSTANTS };
}
