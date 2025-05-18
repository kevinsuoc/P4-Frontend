import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { firebaseConfig, firebaseVapidKey } from './firebase.config';
import { getFunctions, httpsCallable } from 'firebase/functions';


export const firebaseApp = initializeApp(firebaseConfig);

// Inicializa Firebase App
let messaging: ReturnType<typeof getMessaging> | null = null;

if (typeof window !== 'undefined') {
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
}

// Pide permiso y obtiene el token
export const requestPermission = async (): Promise<string | null> => {
  if (!messaging) {
    console.warn('❌ Firebase Messaging no está disponible en este entorno.');
    return null;
  }

  try {
    const currentToken = await getToken(messaging, {
      vapidKey: firebaseVapidKey,
      serviceWorkerRegistration: await navigator.serviceWorker.ready,
    });

    if (currentToken) {
      //console.log('🎯 Token recibido:', currentToken);
      return currentToken;
    } else {
      console.warn('⚠️ No se pudo obtener token');
      return null;
    }
  } catch (err) {
    console.error('❌ Error al obtener token:', err);
    return null;
  }
};

// Escucha notificaciones en primer plano
export const listenForegroundMessages = () => {
  if (!messaging) {
    console.warn('❌ Firebase Messaging no disponible para escuchar mensajes.');
    return;
  }

  onMessage(messaging, (payload) => {
    console.log('📨 Mensaje en primer plano:', payload);
    const title = payload.notification?.title ?? 'Notificación';
    const body = payload.notification?.body ?? '';
    new Notification(title, { body });
  });
};

export const subscribeToTopic = async (token: string, topic: string) => {
  const functions = getFunctions(firebaseApp);

  try {
    const suscribir = httpsCallable(functions, 'subscribeTokenToTopic');
    const result = await suscribir({ token, topic });
    //console.log('✅ Suscripción exitosa al topic:', result.data);
  } catch (error) {
    console.error('❌ Error al suscribirse al topic:', error);
  }
};

// Exporta messaging si se necesita fuera
export { messaging };
export { firebaseVapidKey };
