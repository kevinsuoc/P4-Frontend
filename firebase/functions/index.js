const functions = require('firebase-functions/v1');
const admin = require("firebase-admin");
admin.initializeApp();

exports.notificacionCrear = functions.firestore
  .document('jugadores/{id}')
  .onCreate((snap , context ) => { 
    const message = {
        notification: {
          title: "create",
        },
        topic: "frontmobi",
        data: {
            type: "create",
             body: "Se ha creado el jugador",
            id: context.params.id,
          },
      };

      return admin.messaging().send(message)
        .then(() => {console.log("Notificación enviada correctamente");})
        .catch((error) => {console.error("Error al enviar la notificación:", error);});
   });


exports.notificacionActualizar =  functions.firestore
.document('jugadores/{id}')
.onUpdate((change , context ) => { 
    const message = {
        notification: {
          title: "update",
        },
        topic: "frontmobi",
        data: {
            type: "update",
            body: "Jugador actualizado correctamente",
            id: context.params.id,
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
          title: "delete",
          body: "Jugador eliminado"
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

exports.subscribeTokenToTopic = functions.https.onCall(async (data, context) => {
  const token = data.token;
  const topic = 'frontmobi';

  if (!token || !topic) {
    throw new functions.https.HttpsError('invalid-argument', 'Token and topic are required');
  }

  try {
    const response = await admin.messaging().subscribeToTopic(token, topic);
    console.log('Subscrito: ', response);
    return { success: true, response };
  } catch (error) {
    console.error('No subscrito: ', error);
    throw new functions.https.HttpsError('Error: ', error.message, error);
  }
});
