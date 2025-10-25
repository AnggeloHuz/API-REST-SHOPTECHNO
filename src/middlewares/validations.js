export const equality = (itemA, itemB) => {
  return itemA === itemB;
};

export const validatePassword = (password) => {
  /**
   * Valida si una contraseña cumple con los siguientes requisitos:
   * - Mínimo 8 caracteres, Máximo 15
   * - Al menos una letra mayúscula
   * - Al menos una letra minúscula
   * - Al menos un dígito
   * - No espacios en blanco
   * - Al menos 1 caracter especial (@, $, !, %, *, ?, &)
   * * @param {string} password La contraseña a validar.
   * @returns {boolean} `true` si la contraseña es válida, `false` en caso contrario.
   */

  // La expresión regular:
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;

  // Devuelve el resultado del test
  return passwordRegex.test(password);
  // 
};

export function validateEmail(email) {
  // Expresión regular para validar el formato básico de un email
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  // .test() devuelve true si la cadena coincide con la regex, false si no
  return regex.test(String(email).toLowerCase()); //true si es valido, false si el erroneo
}
