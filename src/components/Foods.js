import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFoods, fetchFoodTypes, addFood, deleteFood } from '../store/actions/foodActions';
import Modal from 'react-modal';

const Foods = () => {
    const dispatch = useDispatch();
    const foods = useSelector(state => state.foods.foods);
    const foodTypes = useSelector(state => state.foods.foodTypes);
    const loading = useSelector(state => state.foods.loading);
    const [search, setSearch] = useState('');
    const [isAddFoodOpen, setAddFoodOpen] = useState(false);
    const [newFood, setNewFood] = useState({ name: '', carbs: '', calories: '', type: '' });

    useEffect(() => {
        dispatch(fetchFoods());
        dispatch(fetchFoodTypes());
    }, [dispatch]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const filteredFoods = foods.filter(food => food.name.toLowerCase().includes(search.toLowerCase()));

    const handleAddFood = () => {
        dispatch(addFood(newFood));
        setAddFoodOpen(false);
        setNewFood({ name: '', carbs: '', calories: '', type: '' });
    };

    const handleDeleteFood = (id) => {
        dispatch(deleteFood(id));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFood({ ...newFood, [name]: value });
    };

    return (
        <div>
            <div className="food-header">
                <input
                    type="text"
                    placeholder="Search for foods..."
                    value={search}
                    onChange={handleSearchChange}
                />
                <button onClick={() => setAddFoodOpen(true)}>Add Food</button>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Carbs</th>
                            <th>Calories</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFoods.map(food => (
                            <tr key={food.id}>
                                <td>{food.name}</td>
                                <td>{food.carbs}</td>
                                <td>{food.calories}</td>
                                <td>{food.type}</td>
                                <td>
                                    <button onClick={() => handleDeleteFood(food.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <Modal isOpen={isAddFoodOpen} onRequestClose={() => setAddFoodOpen(false)}>
                <h2>Add Food</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={newFood.name}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="carbs"
                    placeholder="Carbs"
                    value={newFood.carbs}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="calories"
                    placeholder="Calories"
                    value={newFood.calories}
                    onChange={handleInputChange}
                />
                <select name="type" value={newFood.type} onChange={handleInputChange}>
                    <option value="">Select Type</option>
                    {foodTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                <button onClick={handleAddFood}>Add Food</button>
                <button onClick={() => setAddFoodOpen(false)}>Close</button>
            </Modal>
        </div>
    );
};

export default Foods;
