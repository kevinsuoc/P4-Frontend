import { StyleSheet } from "react-native";

export const formStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
    alignItems: 'center', 
  },
  input: {
    width: '90%',
    height: 50,
    backgroundColor: "white",
    paddingHorizontal: 15,
    fontSize: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    maxWidth: 600,
    alignSelf: 'center',
  },
  picker: {
    width: '90%',
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginBottom: 12,
    alignSelf: 'center',
    maxWidth: 600
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
  button: {
    width: '90%',
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    marginVertical: 10,
    maxWidth: 600,
    alignSelf: 'center',

  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    maxWidth: 600,
    alignSelf: 'center',
  },
});
