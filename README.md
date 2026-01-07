# MicroGuard - AI-Powered Microplastic Detection Platform

A modern web platform for real-time microplastic detection in blood and water samples, powered by IoT sensors and AI analysis.

## 🌟 Features

- **Real-Time Detection**: Live sensor data streaming from IoT hardware via Firebase
- **AI Analysis**: Intelligent insights powered by Google Gemini AI
- **User Authentication**: Secure signup/login with Firebase Authentication
- **Historical Tracking**: Complete test history with detailed results
- **Risk Assessment**: Automated risk level calculation and health recommendations
- **Responsive Design**: Beautiful, futuristic UI that works on all devices

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Internet connection (for Firebase and AI API)

### Installation

1. **Clone or download** the project files
2. **Open** `index.html` in your web browser
3. **Sign up** for a new account
4. **Start detecting** microplastics!

### Project Structure

```
Micro Plastic Detection/
├── index.html              # Landing page with authentication
├── dashboard.html          # Main dashboard interface
├── css/
│   └── styles.css         # Complete design system
└── js/
    ├── config.js          # Firebase & Gemini configuration
    ├── firebase-init.js   # Firebase initialization
    ├── auth.js            # Authentication manager
    ├── dashboard.js       # Dashboard functionality
    └── detection.js       # Detection & AI analysis
```

## 🔧 Configuration

### Firebase Setup

The Firebase configuration is already included in `js/config.js`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDgig1OyHWd1fSUODxA4_lLKhqGTvd0j7M",
  authDomain: "micro-plastic-abbf1.firebaseapp.com",
  databaseURL: "https://micro-plastic-abbf1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "micro-plastic-abbf1",
  // ... other config
};
```

### IoT Sensor Data Structure

The platform expects sensor data in Firebase Realtime Database:

```
/SensorData
  - BloodDetection: "30%"  (string percentage)
  - WaterDetection: "78%"  (string percentage)
```

Your IoT hardware should update these paths with real-time percentage values.

## 📖 Usage Guide

### For Users

1. **Sign Up**: Create an account with your name, mobile, email, and password
2. **Login**: Access your dashboard with your credentials
3. **Run Detection**: Click "Blood Detection" or "Water Detection"
4. **View Results**: Wait for the scan to complete and review AI insights
5. **Track History**: Check your past test results in the history section

### For Developers

#### Customizing the Theme

Edit CSS variables in `css/styles.css`:

```css
:root {
  --color-primary: hsl(195, 100%, 50%);
  --color-secondary: hsl(280, 100%, 65%);
  /* ... other variables */
}
```

#### Modifying AI Analysis

Edit the AI prompt in `js/detection.js`:

```javascript
buildAIPrompt(detectionValue, type) {
  // Customize the prompt sent to Gemini AI
}
```

#### Adjusting Scan Duration

Change the scan duration in `js/config.js`:

```javascript
const APP_CONSTANTS = {
  SCAN_DURATION: 8000, // milliseconds
  // ...
};
```

## 🎨 Design System

### Color Palette
- **Primary**: Cyan (`#00BFFF`)
- **Secondary**: Purple (`#B366FF`)
- **Accent**: Pink (`#FF3385`)
- **Background**: Dark Blue-Gray

### Typography
- **Primary Font**: Inter
- **Display Font**: Outfit
- **Sizes**: Responsive from 0.75rem to 3rem

### Components
- Glassmorphism cards
- Animated modals
- Status badges
- Gradient buttons
- Real-time scanning animation

## 🔒 Security Notes

> **⚠️ Important for Production:**
> - API keys are currently client-side visible
> - Implement a backend proxy for API calls in production
> - Configure Firebase security rules
> - Add rate limiting for API requests
> - Enable HTTPS

## 📊 Data Flow

1. **IoT Device** → Updates Firebase `/SensorData`
2. **Web App** → Listens to Firebase for real-time updates
3. **Detection Complete** → Sends data to Gemini AI
4. **AI Response** → Parsed and displayed to user
5. **Results Saved** → Stored in Firebase `/detections/{userId}`

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase (Authentication, Realtime Database)
- **AI**: Google Gemini 2.0 Flash API
- **Design**: Custom CSS with Glassmorphism
- **Fonts**: Google Fonts (Inter, Outfit)

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

## 🐛 Troubleshooting

### Authentication Issues
- Ensure Firebase config is correct
- Check browser console for errors
- Verify internet connection

### Detection Not Working
- Confirm IoT device is updating Firebase
- Check Firebase Realtime Database rules
- Verify sensor data format is correct

### AI Analysis Failing
- Check Gemini API key is valid
- Verify API endpoint is accessible
- Review browser console for errors

## 📄 License

This project is for educational and demonstration purposes.

## 👥 Support

For issues or questions, please check:
- Browser console for error messages
- Firebase console for database status
- Network tab for API call failures

## 🎯 Roadmap

- [ ] Add Chart.js for data visualization
- [ ] Implement PDF report generation
- [ ] Add email notifications
- [ ] Create admin dashboard
- [ ] Multi-language support
- [ ] Dark/light theme toggle
- [ ] Mobile app version

---

**Built with ❤️ for health and environmental safety**
