const errorTranslations: { [key: string]: string } = {

    // Errores comunes para registro
    "User already exists": "El usuario ya existe",
    "Invalid parameter": "Parámetro inválido",
    "Password did not conform with policy: Password not long enough":
      "La contraseña no cumple con la política: la contraseña no es lo suficientemente larga",
    "Password did not conform with policy: Password must have uppercase characters":
      "La contraseña no cumple con la política: la contraseña debe tener caracteres en mayúscula",
    "Password did not conform with policy: Password must have lowercase characters":
      "La contraseña no cumple con la política: la contraseña debe tener caracteres en minúscula",
    "Password did not conform with policy: Password must have numeric characters":
      "La contraseña no cumple con la política: la contraseña debe tener caracteres numéricos",
    "Password did not conform with policy: Password must have symbol characters":
      "La contraseña no cumple con la política: la contraseña debe tener caracteres de símbolo",
    "An account with the given email already exists.":
      "Ya existe una cuenta con el correo electrónico proporcionado.",
    "Invalid verification code provided, please try again.":
      "Código de verificación inválido, por favor intente de nuevo.",
    "Your confirmation code is incorrect or has expired, please request a new code.":
      "Tu código de confirmación es incorrecto o ha expirado, por favor solicita un nuevo código.",
    "Your confimation code has expired": "Tu código de confirmación ha expirado",
    
    // Errores comunes para login
    "Network error": "Error en la red, revisa tu conexión",
    "User not found.": "Usuario no encontrado",
    "Incorrect username or password.": "Usuario o contraseña incorrectos",
    "User is not confirmed.": "El usuario no está confirmado",
    "User does not exist.": "El usuario no existe",
    "Password reset required for the user":
      "El usuario debe restablecer su contraseña antes de poder iniciar sesión.",
  };
  
export const translateCognitoError = (message: string): string => errorTranslations[message] || message;
  