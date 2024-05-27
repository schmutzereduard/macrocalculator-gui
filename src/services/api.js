import axios from 'axios';

const API_URL = 'http://localhost:8080/foods';

export const getFoods = async () => {
    return await axios.get(API_URL);
};

export const saveFood = async (food) => {
    return await axios.put(API_URL, food);
};

export const deleteFood = async (id) => {
    return await axios.delete(`${API_URL}/${id}`);
};
