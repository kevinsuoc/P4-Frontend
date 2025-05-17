import React from 'react';
import { Stack, useRouter } from "expo-router";
import { Text, TouchableOpacity, Linking, Platform, View } from 'react-native';
import { getApps, initializeApp } from '@react-native-firebase/app';
import { firebaseConfig } from '../app.config';
import { indexStyles } from '../styles/indexStyles';
import {PermissionsAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

messaging()
  .subscribeToTopic('frontmobi')
  .then(() => console.log('Subscribed to topic'));

if (Platform.OS === "web"){
  if (getApps().length === 0)
    initializeApp(firebaseConfig);
}

function HeaderTitle() {
  return (
    <Text style={{
      fontSize: 26,
      fontWeight: 'bold',
      color: '#1E3A8A',
      marginLeft: 10
    }}>
      🏀 FrontMobi
    </Text>
  );
}

function HomeButton() {
  const router = useRouter();

  const handleHomeButton = () => {
    router.dismissTo('/')
  };

  return <TouchableOpacity onPress={handleHomeButton} style={indexStyles.botonPrincipal}><Text style={indexStyles.textoBoton}>Inicio</Text></TouchableOpacity>;
}

function GitHubButton() {
  const handleGitHubButton = () => {
      Linking.openURL('https://github.com/kevinsuoc/P3-Frontend');
  };

  return (
    <TouchableOpacity onPress={handleGitHubButton} style={indexStyles.botonPrincipal}><Text style={indexStyles.textoBoton}>GitHub</Text></TouchableOpacity>
  );
}

function HeaderButtons() {
  return (
      <View style={{ flexDirection: 'row', gap: 10 }}>
          <HomeButton />
          <GitHubButton />
      </View>
  );
}

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerTitle: () => <HeaderTitle />, headerRight: () => <HeaderButtons /> }}
      />

      <Stack.Screen 
        name="details/[id]" 
        options={{ title: 'Detalle', headerRight: () => <HeaderButtons /> }} 
      />
      <Stack.Screen 
        name="multimedia/[id]" 
        options={{ title: 'Multimedia', headerRight: () => <HeaderButtons /> }} 
      />
      <Stack.Screen 
        name="details/image/[url]" 
        options={{ title: 'Imagen de perfil', headerRight: () => <HeaderButtons /> }} 
      />
      <Stack.Screen 
        name="(agregar)/agregar"
        options={{title: 'Añadir jugador', headerRight: () => <HeaderButtons/>}}
      />
      <Stack.Screen 
        name="details/editar/[id]"
        options={{title: 'Editar jugador', headerRight: () => <HeaderButtons/>}}
      />
    </Stack>
  );
}