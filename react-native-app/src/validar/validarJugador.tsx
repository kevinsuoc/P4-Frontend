import { Jugador } from "../jugador";

const validarTexto = (min: number, max: number, texto: string, nombre: string): string | null => {
    if (!texto.length || texto.length < min || texto.length > max)
        return `${nombre} debe tener entre ${min} y ${max} caracteres`;
    return null;
}

const validarNumero = (min: number, max: number, texto: string, nombre: string): string | null => {
    const num = parseInt(texto, 10);
    if (isNaN(num) || num < min || num > max)
        return `${nombre} debe estar entre ${min} y ${max}`
    return null;
}

export const validarJugador = (jugador: Jugador): string[] => {
        const errores: string[] = [];
        const nombreValido = validarTexto(3, 30, jugador.Nombre, "Nombre");
        if (nombreValido) errores.push(nombreValido)
        const posicionValido = validarTexto(3, 10, jugador.Posicion, "Posicion");
        if (posicionValido) errores.push(posicionValido)
        const dorsalValido = validarNumero(1, 99, String(jugador.Dorsal), "Dorsal");
        if (dorsalValido) errores.push(dorsalValido)
        const edadValido = validarNumero(1, 70, String(jugador.Edad), "Edad");
        if (edadValido) errores.push(edadValido)
        const nacionalidadValido = validarTexto(3, 30, jugador.Nacionalidad, "Nacionalidad");
        if (nacionalidadValido) errores.push(nacionalidadValido)
        const descripcionValido = validarTexto(5, 500, jugador.Descripcion, "Descripcion");
        if (descripcionValido) errores.push(descripcionValido)
        const alturaValido = validarTexto(2, 10, jugador.Altura, "Altura");
        if (alturaValido) errores.push(alturaValido)
        return errores;
    }
