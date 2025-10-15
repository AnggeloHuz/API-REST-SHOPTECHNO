import * as bcrypt from 'bcrypt';

const saltRounds = 10;

// Función para hashear la contraseña
export const hashearPassword = async (password) => {
    try {
        // Genera el "salt" y el "hash" en una sola llamada
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        console.error("Error al hashear:", error);
        throw error;
    }
}