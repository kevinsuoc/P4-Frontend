import { Injectable } from '@angular/core';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging, firebaseVapidKey } from '../../firebase-messaging';
import { subscribeToTopic } from '../../firebase-messaging';

@Injectable({ providedIn: 'root' })
export class MessagingService {

  requestPermission() {
    if (
      typeof window !== 'undefined' &&
      'Notification' in window
    ) {
      Notification.requestPermission().then(async (permission) => {
        if (permission === 'granted') {
          //console.log('✅ Notification permission granted.');

          if (messaging !== null) {
            try {
              const token = await getToken(messaging, {
                vapidKey: firebaseVapidKey,
                serviceWorkerRegistration: await navigator.serviceWorker.ready,
              });

              if (token) {
                //console.log('✅ FCM Token:', token);
                await subscribeToTopic(token, 'frontmobi'); 
              } else {
                console.warn('⚠️ No se pudo obtener el token FCM');
              }

            } catch (err) {
              console.error('❌ Error al obtener el token FCM:', err);
            }
          } else {
            console.warn('❌ Firebase Messaging no inicializado.');
          }

        } else {
          console.warn('❌ Notification permission denied.');
        }
      });
    } else {
      console.warn('❌ Notifications no soportadas o fuera del navegador.');
    }
  }


  listen() {
    if (typeof window !== 'undefined' && messaging !== null) {
      onMessage(messaging, (payload: any) => {
        console.log('📥 Mensaje recibido en foreground:', payload);

        const title = payload.notification?.title ?? 'Notificación';
        const body = payload.data?.body ?? 'Nuevo mensaje';

        new Notification(title, {
          body: body,
          icon: '../../../public/assets/favicon.ico', 
        });
      });
    } else {
      console.warn('❌ No se puede escuchar mensajes: messaging no inicializado o fuera del navegador.');
    }
  }
}