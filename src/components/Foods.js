import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFoods, fetchFoodTypes, addFood, updateFood, deleteFood } from '../store/actions/foodActions';
import Modal from 'react-modal';

const Foods = () => {
    const dispatch = useDispatch();
    const foods = useSelector(state => state.foods.foods);
    const foodTypes = useSelector(state => state.foods.foodTypes);
    const loading = useSelector(state => state.foods.loading);
    const [search, setSearch] = useState('');
    const [isAddFoodOpen, setAddFoodOpen] = useState(false);
    const [isEditFoodOpen, setEditFoodOpen] = useState(false);
    const [newFood, setNewFood] = useState({ name: '', carbs: '', calories: '', type: '' });
    const [editingFood, setEditingFood] = useState(null);

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
        if (window.confirm('Are you sure you want to delete this food?')) {
            dispatch(deleteFood(id));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFood({ ...newFood, [name]: value });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingFood({ ...editingFood, [name]: value });
    };

    const openEditModal = (food) => {
        setEditingFood(food);
        setEditFoodOpen(true);
    };

    const handleUpdateFood = () => {
        dispatch(updateFood(editingFood));
        setEditFoodOpen(false);
        setEditingFood(null);
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
                                    <button onClick={() => openEditModal(food)}>Edit</button>
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
                <button onClick={() => setAddFoodOpen(false)}>Cancel</button>
            </Modal>
            {editingFood && (
                <Modal isOpen={isEditFoodOpen} onRequestClose={() => setEditFoodOpen(false)}>
                    <h2>Edit Food</h2>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={editingFood.name}
                        onChange={handleEditInputChange}
                    />
                    <input
                        type="number"
                        name="carbs"
                        placeholder="Carbs"
                        value={editingFood.carbs}
                        onChange={handleEditInputChange}
                    />
                    <input
                        type="number"
                        name="calories"
                        placeholder="Calories"
                        value={editingFood.calories}
                        onChange={handleEditInputChange}
                    />
                    <select name="type" value={editingFood.type} onChange={handleEditInputChange}>
                        <option value="">Select Type</option>
                        {foodTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <button onClick={handleUpdateFood}>Save</button>
                    <button onClick={() => setEditFoodOpen(false)}>Cancel</button>
                </Modal>
            )}
        </div>
    );
};

export default Foods;
