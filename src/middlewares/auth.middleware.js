// auth.middleware.js
import jwt from 'jsonwebtoken';

/**
 * Middleware de AUTENTICACIÓN
 * Verifica que el token sea válido y extrae los datos del usuario.
 */
export const protectRoute = (req, res, next) => {
  // 1. Obtener el token de la cookie
  const token = req.cookies.token;

  // 2. Si no hay token, no está autorizado
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No hay token.' });
  }

  try {
    // 3. Verificar el token y la firma
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Añadir los datos del usuario (payload) al objeto 'req'
    // Ahora 'req.user' tendrá { id, username, role }
    req.user = decoded; 
    next(); // Pasa al siguiente middleware o a la ruta

  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};


/**
 * Middleware de AUTORIZACIÓN (Roles)
 * Recibe un array de roles permitidos.
 * DEBE ejecutarse DESPUÉS de 'protectRoute'.
 */
export const checkRole = (rolesPermitidos) => {
  return (req, res, next) => {
    // protectRoute ya debió establecer req.user
    const userRole = req.user.role;

    if (!rolesPermitidos.includes(userRole)) {
      // 403 Forbidden: El usuario está autenticado, pero no tiene permisos.
      return res.status(403).json({ message: 'Acceso prohibido. No tienes los permisos necesarios.' });
    }
    
    // El usuario tiene el rol, puede continuar
    next(); 
  };
};