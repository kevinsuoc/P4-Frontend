const functions = require('firebase-functions/v1');
const admin = require("firebase-admin");
admin.initializeApp();


exports.subscribeTokenToTopic = functions.https.onCall(async (data, context) => {
  const token = data.token;
  const topic = 'frontmobi';

  try {
    const response = await admin.messaging().subscribeToTopic(token, topic);
    console.log('Subscrito: ', response);
    return { success: true, response };
  } catch (error) {
    console.error('No subscrito: ', error);
    throw new functions.https.HttpsError('Error: ', error.message, error);
  }
});


exports.notificacionCrear = functions.firestore
  .document('jugadores/{id}')
  .onCreate((snap , context ) => { 
    const jugador = snap.data();

    const message = {
        notification: {
          title: `Jugador Creado`,
          body: `Dorsal ${jugador.Dorsal.toString()}, ${jugador.Nombre}. ${jugador.Edad.toString()} años.`
        },
        topic: "frontmobi",
        data: {
          type: "create",
          id: context.params.id,
          Nombre: jugador.Nombre,
          Dorsal: jugador.Dorsal.toString(),
          Posicion: jugador.Posicion,
          Edad: jugador.Edad.toString(),
          Altura: jugador.Altura,
          Nacionalidad: jugador.Nacionalidad,
          Descripcion: jugador.Descripcion,
          Image: jugador.Image || '',
          Video: jugador.Video || '',
        },
      };

      return admin.messaging().send(message)
        .then(() => {console.log("Notificación enviada correctamente");})
        .catch((error) => {console.error("Error al enviar la notificación:", error);});
   });


exports.notificacionActualizar =  functions.firestore
.document('jugadores/{id}')
.onUpdate((change , context ) => { 
  const jugador = change.after.data();

    const message = {
        notification: {
          title: `Jugador Actualizado`,
          body: `${jugador.Nombre}.`
        },
        topic: "frontmobi",
        data: {
          type: "update",
          id: context.params.id,
          Nombre: jugador.Nombre,
          Dorsal: jugador.Dorsal.toString(),
          Posicion: jugador.Posicion,
          Edad: jugador.Edad.toString(),
          Altura: jugador.Altura,
          Nacionalidad: jugador.Nacionalidad,
          Descripcion: jugador.Descripcion,
          Image: jugador.Image || '',
          Video: jugador.Video || '',
        },
      };

        return admin.messaging().send(message)
        .then(() => {console.log("Notificación enviada correctamente");})
        .catch((error) => {console.error("Error al enviar la notificación:", error);});
   });

exports.notificacionBorrar = functions.firestore
.document('jugadores/{id}')
.onDelete((snap , context ) => {
    const message = {
        notification: {
          title: `Jugador Eliminado`,
          body: `${jugador.Nombre}.`
        },
        topic: "frontmobi",
        data: {
            type: "delete",
            id: context.params.id,
          },
      };

      return  admin.messaging().send(message)
        .then(() => {console.log("Notificación enviada correctamente");})
        .catch((error) => {console.error("Error al enviar la notificación:", error);});
   });


   