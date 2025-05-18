import { environment } from '../../angular-app/src/environments/environments';

export const firebaseConfig = environment.firebaseConfig;
export const firebaseVapidKey: string = environment.firebaseConfig.vapidKey as string;