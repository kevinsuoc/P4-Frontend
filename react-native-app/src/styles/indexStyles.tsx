import { StyleSheet } from "react-native";

export const indexStyles = StyleSheet.create({
  mainView: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
    backgroundColor: "#f5f5f5",
  },
  filtroContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    flexWrap: "wrap",
  },
  separador: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
    maxWidth: 600,
    alignSelf: 'center',
  },
  elementoListaJugador: {
    width: "100%",
  },
  jugadorView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    width: "100%",
    maxWidth: 600,
    alignSelf: 'center',
  },
  logoJugador: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    borderRadius: 25,
  },
  picker: {
    height: 50,
    width: '90%',
    fontSize: 18,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    color: '#333',
    marginBottom: 15,
    alignSelf: 'center',
    maxWidth: 600
  },
  buscador: {
    height: 50,
    width: '90%',
    fontSize: 18,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    color: '#333',
    marginBottom: 15,
    alignSelf: 'center',
    maxWidth: 600
  },
  botonPrincipal: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 15, 
    alignItems: 'center',
    marginVertical: 10,
    maxWidth: 600,
    alignSelf: 'center',
  },
  
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    maxWidth: 600
  }
  
  
});
