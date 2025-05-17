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