import api from './api';

export const getUsers = async (query) => {
  try {
    const response = await api.get(`/users?query=${query}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários', error);
    throw error;
  }
};

export const getUser = async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários', error);
      throw error;
    }
  };
  

export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar usuário', error);
    throw error;
  }
};

export const updateUser = async (id,userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar atualizar', error);
      throw error;
    }
  };

export const delteUser = async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar usuário', error);
      throw error;
    }
  };