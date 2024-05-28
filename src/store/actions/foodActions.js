// src/actions/foodActions.js
export const ADD_FOOD = 'ADD_FOOD';
export const DELETE_FOOD = 'DELETE_FOOD';
export const UPDATE_FOOD = 'UPDATE_FOOD';

export const addFood = (food) => ({
    type: ADD_FOOD,
    payload: food,
});

export const deleteFood = (id) => ({
    type: DELETE_FOOD,
    payload: id,
});

export const updateFood = (food) => ({
    type: UPDATE_FOOD,
    payload: food,
});
