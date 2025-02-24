// src/auth/services/cognitoService.ts
import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUserSession,
} from "amazon-cognito-identity-js";

// Configuración centralizada
const poolData = {
  UserPoolId: "sa-east-1_GrhcU9w1x",
  ClientId: "154molkqkfmfle2s7nj7m21eoe",
};

const userPool = new CognitoUserPool(poolData);

/** Función para registrar un usuario */
export const signUpUser = (
  username: string,
  password: string,
  name: string,
  email: string
): Promise<CognitoUser> => {
  return new Promise((resolve, reject) => {
    const attributeList = [
      new CognitoUserAttribute({ Name: "name", Value: name }),
      new CognitoUserAttribute({ Name: "email", Value: email }),
    ];

    userPool.signUp(username, password, attributeList, [], (err, result) => {
      if (err) return reject(err);
      resolve(result!.user);
    });
  });
};

/** Función para confirmar el registro de un usuario */
export const confirmUserRegistration = (
  cognitoUser: CognitoUser,
  code: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

/** Función para autenticar a un usuario */
export const authenticateUser = (
  username: string,
  password: string
): Promise<CognitoUserSession> => {
  return new Promise((resolve, reject) => {
    const userData = {
      Username: username,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    const authDetails = new AuthenticationDetails({ Username: username, Password: password });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (session) => resolve(session),
      onFailure: (err) => reject(err),
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        // Puedes gestionar el caso de "nueva contraseña requerida" según tus necesidades.
        reject({ code: "NEW_PASSWORD_REQUIRED", userAttributes, requiredAttributes });
      },
    });
  });
};

/** Función para obtener el usuario actual */
export const getCurrentUser = (): CognitoUser | null => {
  return userPool.getCurrentUser();
};

/** Función para cerrar la sesión del usuario actual */
export const signOutUser = (): void => {
  const currentUser = userPool.getCurrentUser();
  if (currentUser) {
    currentUser.signOut();
  }
};
