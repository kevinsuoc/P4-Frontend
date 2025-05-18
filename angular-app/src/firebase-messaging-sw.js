importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCmUF1A3xyrltE3IAKinWwsWOYDj1j0maY",
  authDomain: "uoc-frontmobi.firebaseapp.com",
  databaseURL: "https://uoc-frontmobi-default-rtdb.firebaseio.com",
  projectId: "uoc-frontmobi",
  storageBucket: "uoc-frontmobi.firebasestorage.app",
  messagingSenderId: "892525709028",
  appId: "1:892525709028:web:fc4409e554533d6e5f4ef1",
  vapidKey: "BKw630KZgGwT9Niu6wn_WomwYYlsM6-6n67tKQcI5HRFrwa7KTtdui5FVmLafvG3rQgae3huyyLFmMYjCsWsI1k"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Mensaje recibido en segundo plano:', payload);
  const { title, body } = payload.notification;

  self.registration.showNotification(title, {
    body,
    icon: '' 
  });
});