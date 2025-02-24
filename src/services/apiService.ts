// src/services/apiService.ts
import axios from 'axios';

// Reemplaza la URL base por la de tu API Gateway desplegada
const API_BASE_URL = 'https://4mlmxxsj4l.execute-api.sa-east-1.amazonaws.com/prod';


export const createUserRecord = async (user: {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  lists: any[];
  sharedLists: any[];
  notifications: any[];
}) => {
  const token = localStorage.getItem('cognitoToken');
  return axios.post(`${API_BASE_URL}/users`, user, {
    headers: {
      Authorization: token ? token : '',
    },
  });
};

export const getUserData = async (id: string) => {
  const token = localStorage.getItem('cognitoToken');
  return axios.get(`${API_BASE_URL}/users/${id}`, {
    headers: {
      Authorization: token ? token : '',
    },
  });
};

// Función para actualizar los datos del usuario mediante PATCH
export const updateUserData = async (user: {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  lists: any[];
  sharedLists: any[];
  notifications: any[];
}) => {
  const token = localStorage.getItem('cognitoToken');
  return axios.patch(`${API_BASE_URL}/users/${user.id}`, user, {
    headers: {
      Authorization: token ? token : '',
    },
  });
};
