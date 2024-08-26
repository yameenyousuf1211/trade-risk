// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js",
);

// Initialize the Firebase app in the service worker
const firebaseConfig = {
  apiKey: "AIzaSyB2vQF6VvbKH035VXbXxAz5KgccDfbU31U",
  authDomain: "traderisk-463ed.firebaseapp.com",
  projectId: "traderisk-463ed",
  storageBucket: "traderisk-463ed.appspot.com",
  messagingSenderId: "197657815368",
  appId: "1:197657815368:web:5bc3ed391b4a07286feb7d"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  console.log(payload, "PAYLOAD");
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});