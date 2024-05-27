import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const getFoods = async () => {
    return await axios.get(`${API_URL}/foods`);
};

export const saveFood = async (food) => {
    return await axios.put(`${API_URL}/foods`, food);
};

export const deleteFood = async (id) => {
    return await axios.delete(`${API_URL}/foods/${id}`);
};

export const getFoodTypes = async () => {
    return await axios.get(`${API_URL}/food-types`);
};
