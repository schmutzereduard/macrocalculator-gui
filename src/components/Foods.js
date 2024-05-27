import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Foods.css';

const Foods = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newFoodName, setNewFoodName] = useState('');
    const [newFoodCarbs, setNewFoodCarbs] = useState('');
    const [newFoodKCalories, setNewFoodKCalories] = useState('');
    const [editFoodId, setEditFoodId] = useState(null);
    const [editFoodName, setEditFoodName] = useState('');
    const [editFoodCarbs, setEditFoodCarbs] = useState('');
    const [editFoodKCalories, setEditFoodKCalories] = useState('');

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const response = await axios.get('http://localhost:8080/foods');
                setFoods(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchFoods();
    }, []);

    const handleAddFood = async () => {
        try {
            const response = await axios.post('http://localhost:8080/foods', {
                name: newFoodName,
                carbs: newFoodCarbs,
                kCalories: newFoodKCalories
            });
            setFoods([...foods, response.data]);
            setNewFoodName('');
            setNewFoodCarbs('');
            setNewFoodKCalories('');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeleteFood = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/foods/${id}`);
            setFoods(foods.filter(food => food.id !== id));
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEditFood = (food) => {
        setEditFoodId(food.id);
        setEditFoodName(food.name);
        setEditFoodCarbs(food.carbs);
        setEditFoodKCalories(food.kCalories);
    };

    const handleUpdateFood = async () => {
        try {
            const response = await axios.put(`http://localhost:8080/foods/${editFoodId}`, {
                name: editFoodName,
                carbs: editFoodCarbs,
                kCalories: editFoodKCalories
            });
            setFoods(foods.map(food => (food.id === editFoodId ? response.data : food)));
            setEditFoodId(null);
            setEditFoodName('');
            setEditFoodCarbs('');
            setEditFoodKCalories('');
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="foods-container">
            <h2>Foods</h2>
            <div className="add-food-form">
                <input type="text" placeholder="Name" value={newFoodName} onChange={(e) => setNewFoodName(e.target.value)} />
                <input type="number" placeholder="Carbs" value={newFoodCarbs} onChange={(e) => setNewFoodCarbs(e.target.value)} />
                <input type="number" placeholder="KCalories" value={newFoodKCalories} onChange={(e) => setNewFoodKCalories(e.target.value)} />
                <button onClick={handleAddFood}>Add Food</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Carbs</th>
                        <th>KCalories</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {foods.map(food => (
                        <tr key={food.id}>
                            <td>{food.name}</td>
                            <td>{food.carbs}</td>
                            <td>{food.kCalories}</td>
                            <td>
                                <button onClick={() => handleDeleteFood(food.id)}>Delete</button>
                                <button onClick={() => handleEditFood(food)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {editFoodId && (
                <div className="edit-food-form">
                    <h3>Edit Food</h3>
                    <input type="text" placeholder="Name" value={editFoodName} onChange={(e) => setEditFoodName(e.target.value)} />
                    <input type="number" placeholder="Carbs" value={editFoodCarbs} onChange={(e) => setEditFoodCarbs(e.target.value)} />
                    <input type="number" placeholder="KCalories" value={editFoodKCalories} onChange={(e) => setEditFoodKCalories(e.target.value)} />
                    <button onClick={handleUpdateFood}>Update Food</button>
                </div>
            )}
        </div>
    );
};

export default Foods;
    