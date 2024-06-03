import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchFoods, fetchFoodTypes, addFood, updateFood, deleteFood } from '../store/actions/foodActions';

const Foods = ({ foods, foodTypes, fetchFoods, fetchFoodTypes, addFood, updateFood, deleteFood, loading, error }) => {
    const [newFood, setNewFood] = useState({
        name: '',
        carbs: '',
        calories: '',
        type: ''
    });

    const [editingFood, setEditingFood] = useState(null);

    useEffect(() => {
        fetchFoods();
        fetchFoodTypes();
    }, [fetchFoods, fetchFoodTypes]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFood({ ...newFood, [name]: value });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingFood({ ...editingFood, [name]: value });
    };

    const handleAddFood = () => {
        addFood(newFood);
        setNewFood({ name: '', carbs: '', calories: '', type: '' });
    };

    const handleDeleteFood = (id) => {
        deleteFood(id);
    };

    const handleEditFood = (food) => {
        setEditingFood(food);
    };

    const handleUpdateFood = () => {
        updateFood(editingFood);
        setEditingFood(null);
    };

    return (
        <div>
            <h1>Foods</h1>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
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
                    {(Array.isArray(foods) ? foods : []).map(food => (
                        <tr key={food.id}>
                            <td>{food.name}</td>
                            <td>{food.carbs}</td>
                            <td>{food.calories}</td>
                            <td>{food.type}</td>
                            <td>
                                <button onClick={() => handleEditFood(food)}>Edit</button>
                                <button onClick={() => handleDeleteFood(food.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2>Add Food</h2>
            <input
                type="text"
                name="name"
                value={newFood.name}
                onChange={handleInputChange}
                placeholder="Name"
            />
            <input
                type="number"
                name="carbs"
                value={newFood.carbs}
                onChange={handleInputChange}
                placeholder="Carbs"
            />
            <input
                type="number"
                name="calories"
                value={newFood.calories}
                onChange={handleInputChange}
                placeholder="Calories"
            />
            <select name="type" value={newFood.type} onChange={handleInputChange}>
                <option value="">Select Type</option>
                {foodTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                ))}
            </select>
            <button onClick={handleAddFood}>Add</button>

            {editingFood && (
                <div>
                    <h2>Edit Food</h2>
                    <input
                        type="text"
                        name="name"
                        value={editingFood.name}
                        onChange={handleEditInputChange}
                        placeholder="Name"
                    />
                    <input
                        type="number"
                        name="carbs"
                        value={editingFood.carbs}
                        onChange={handleEditInputChange}
                        placeholder="Carbs"
                    />
                    <input
                        type="number"
                        name="calories"
                        value={editingFood.calories}
                        onChange={handleEditInputChange}
                        placeholder="Calories"
                    />
                    <select name="type" value={editingFood.type} onChange={handleEditInputChange}>
                        <option value="">Select Type</option>
                        {foodTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <button onClick={handleUpdateFood}>Update</button>
                </div>
            )}
        </div>
    );
};

const mapStateToProps = (state) => ({
    foods: state.foods.foods,
    foodTypes: state.foods.foodTypes,
    loading: state.foods.loading,
    error: state.foods.error
});

const mapDispatchToProps = {
    fetchFoods,
    fetchFoodTypes,
    addFood,
    updateFood,
    deleteFood
};

export default connect(mapStateToProps, mapDispatchToProps)(Foods);
