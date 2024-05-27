import React, { useEffect, useState } from 'react';
import { getFoods, deleteFood } from '../services/api';
import FoodForm from './FoodForm';

const FoodList = () => {
    const [foods, setFoods] = useState([]);

    useEffect(() => {
        fetchFoods();
    }, []);

    const fetchFoods = async () => {
        const response = await getFoods();
        setFoods(response.data);
    };

    const handleDelete = async (id) => {
        await deleteFood(id);
        fetchFoods();
    };

    return (
        <div>
            <h1>Foods</h1>
            <FoodForm fetchFoods={fetchFoods} />
            <ul>
                {foods.map((food) => (
                    <li key={food.id}>
                        {food.name} - Carbs: {food.carbs}, Kcal: {food.kcalories}
                        <button onClick={() => handleDelete(food.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FoodList;
