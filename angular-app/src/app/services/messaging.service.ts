import { Injectable } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { inject } from '@angular/core';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class MessagingService {
  private messaging = inject(Messaging);

  requestPermission() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission().then(async (permission) => {
        if (permission === 'granted') {
          console.log('✅ Notification permission granted.');
          try {
            const token = await getToken(this.messaging, {
              vapidKey: environment.firebaseConfig.vapidKey,
            });
            if (token) {
                console.log('✅ FCM Token:', token);
                this.subscribeToTopic(token);
                } else {
                console.warn('⚠️ No se pudo obtener el token FCM');
                }
            
          } catch (err) {
            console.error('❌ Error getting token', err);
          }
        } else {
          console.warn('❌ Notification permission denied.');
        }
      });
    } else {
      console.warn('❌ Notifications not supported or not running in browser context.');
    }
  }

  listen() {
    if (typeof window !== 'undefined') {
      onMessage(this.messaging, (payload) => {
        console.log('📥 Mensaje recibido en foreground:', payload);
        alert(payload.notification?.title + '\n' + payload.notification?.body);
      });
    } else {
      console.warn('❌ onMessage no disponible fuera del navegador.');
    }
  }

    subscribeToTopic(token: string) {
        fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/frontmobi`, {
        method: 'POST',
        headers: {
            'Authorization': 'key=TU_SERVER_KEY', // ← Aquí debes poner tu server key real
        },
        })
        .then(response => {
        if (response.ok) {
            console.log('✅ Suscrito al topic "frontmobi"');
        } else {
            console.error('❌ Error al suscribirse al topic:', response.statusText);
        }
        })
        .catch(error => {
        console.error('❌ Error de red al suscribirse al topic:', error);
        });
    }
}