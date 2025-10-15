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
