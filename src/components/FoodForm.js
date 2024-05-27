import React, { useState } from 'react';
import { saveFood } from '../services/api';

const FoodForm = ({ fetchFoods }) => {
    const [food, setFood] = useState({ name: '',  carbs: '', kcalories: '' });

    const handleChange = (e) => {
        setFood({ ...food, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await saveFood(food);
        fetchFoods();
        setFood({ name: '',  carbs: '', kcalories: '' });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add/Update Food</h2>
            <input type="text" name="name" placeholder="Name" value={food.name} onChange={handleChange} required />
            <input type="number" name="carbs" placeholder="Carbs" value={food.carbs} onChange={handleChange} required />
            <input type="number" name="kcalories" placeholder="Kcal" value={food.kcalories} onChange={handleChange} required />
            <button type="submit">Save</button>
        </form>
    );
};

export default FoodForm;
