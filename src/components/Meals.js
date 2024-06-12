import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMeals, addMeal, updateMeal, deleteMeal } from '../store/actions/mealActions';
import { fetchFoods } from '../store/actions/foodActions';
import Modal from 'react-modal';

const Meals = () => {
    const dispatch = useDispatch();
    const meals = useSelector(state => state.meals.meals);
    const foods = useSelector(state => state.foods.foods);
    const loading = useSelector(state => state.meals.loading);
    const [search, setSearch] = useState('');
    const [viewMeal, setViewMeal] = useState(null);
    const [isAddMealOpen, setAddMealOpen] = useState(false);
    const [newMealName, setNewMealName] = useState('');
    const [selectedFoods, setSelectedFoods] = useState([]);
    const [isDeleteMealOpen, setDeleteMealOpen] = useState(false);
    const [deletingMeal, setDeletingMeal] = useState(null);
    const [isAddFoodOpen, setAddFoodOpen] = useState(false);
    const [isDeleteFoodOpen, setDeleteFoodOpen] = useState(false);
    const [deletingFood, setDeletingFood] = useState(null);

    useEffect(() => {
        dispatch(fetchMeals());
        dispatch(fetchFoods());
    }, [dispatch]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const filteredMeals = meals.filter(meal => meal.name.toLowerCase().includes(search.toLowerCase()));

    const toggleViewMeal = (meal) => {
        setViewMeal(viewMeal ? null : meal);
    };

    const handleDeleteMeal = (meal) => {
        setDeletingMeal(meal);
        setDeleteMealOpen(true);
    };

    const confirmDeleteMeal = () => {
        dispatch(deleteMeal(deletingMeal.id));
        setDeleteMealOpen(false);
        setDeletingMeal(null);
    };

    const handleAddMeal = () => {
        const meal = {
            name: newMealName,
            foods: selectedFoods
        };
        dispatch(addMeal(meal));
        setAddMealOpen(false);
        setNewMealName('');
        setSelectedFoods([]);
    };

    const handleAddFoodToMeal = (food) => {
        const updatedMeal = {
            ...viewMeal,
            foods: [...viewMeal.foods, food]
        };
        dispatch(updateMeal(updatedMeal));
        setViewMeal(updatedMeal);
        setAddFoodOpen(false);
    };

    const handleRemoveFoodFromMeal = (foodId) => {
        setDeletingFood(foodId);
        setDeleteFoodOpen(true);
    };

    const confirmDeleteFoodFromMeal = () => {
        const updatedMeal = {
            ...viewMeal,
            foods: viewMeal.foods.filter(food => food.id !== deletingFood)
        };
        dispatch(updateMeal(updatedMeal));
        setViewMeal(updatedMeal);
        setDeleteFoodOpen(false);
        setDeletingFood(null);
    };

    const availableFoods = foods.filter(food => !viewMeal?.foods.some(mealFood => mealFood.id === food.id));

    return (
        <div>
            <div className="meal-header">
                <input
                    type="text"
                    placeholder="Search for meals..."
                    value={search}
                    onChange={handleSearchChange}
                />
                <button onClick={() => setAddMealOpen(true)}>Add Meal</button>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Total Carbs</th>
                            <th>Total Calories</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMeals.map(meal => (
                            <tr key={meal.id}>
                                <td>{meal.name}</td>
                                <td>{meal.foods.reduce((acc, food) => acc + food.carbs, 0)}</td>
                                <td>{meal.foods.reduce((acc, food) => acc + food.calories, 0)}</td>
                                <td>
                                    <button onClick={() => toggleViewMeal(meal)}>
                                        {viewMeal && viewMeal.id === meal.id ? 'Close' : 'View'}
                                    </button>
                                    <button onClick={() => handleDeleteMeal(meal)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {viewMeal && (
                <Modal isOpen={!!viewMeal} onRequestClose={() => setViewMeal(null)}>
                    <h2>{viewMeal.name}</h2>
                    <ul>
                        {viewMeal.foods.map(food => (
                            <li key={food.id}>
                                {food.name} - Carbs: {food.carbs} - Calories: {food.calories}
                                <button onClick={() => handleRemoveFoodFromMeal(food.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setAddFoodOpen(true)}>Add Food</button>
                    <button onClick={() => setViewMeal(null)}>Close</button>
                </Modal>
            )}
            <Modal isOpen={isAddMealOpen} onRequestClose={() => setAddMealOpen(false)}>
                <h2>Add Meal</h2>
                <input
                    type="text"
                    placeholder="Meal name"
                    value={newMealName}
                    onChange={(e) => setNewMealName(e.target.value)}
                />
                <button disabled={selectedFoods.length === 0} onClick={handleAddMeal}>Add Meal</button>
                <button onClick={() => setAddMealOpen(false)}>Close</button>
                <h3>Selected Foods</h3>
                <ul>
                    {selectedFoods.map(food => (
                        <li key={food.id}>
                            {food.name} - Carbs: {food.carbs} - Calories: {food.calories}
                            <button onClick={() => handleRemoveFoodFromMeal(food.id)}>Remove</button>
                        </li>
                    ))}
                </ul>
                <h3>Add Food</h3>
                <ul>
                    {availableFoods.map(food => (
                        <li key={food.id}>
                            {food.name} - Carbs: {food.carbs} - Calories: {food.calories}
                            <button onClick={() => handleAddFoodToMeal(food)}>Add</button>
                        </li>
                    ))}
                </ul>
            </Modal>
            {deletingMeal && (
                <Modal isOpen={isDeleteMealOpen} onRequestClose={() => setDeleteMealOpen(false)}>
                    <h2>Confirm Delete</h2>
                    <p>Are you sure you want to delete this meal?</p>
                    <button onClick={confirmDeleteMeal}>Delete</button>
                    <button onClick={() => setDeleteMealOpen(false)}>Cancel</button>
                </Modal>
            )}
            {viewMeal && (
                <Modal isOpen={isAddFoodOpen} onRequestClose={() => setAddFoodOpen(false)}>
                    <h2>Add Food to {viewMeal.name}</h2>
                    <ul>
                        {availableFoods.map(food => (
                            <li key={food.id}>
                                {food.name} - Carbs: {food.carbs} - Calories: {food.calories}
                                <button onClick={() => handleAddFoodToMeal(food)}>Add</button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setAddFoodOpen(false)}>Close</button>
                </Modal>
            )}
            {deletingFood && (
                <Modal isOpen={isDeleteFoodOpen} onRequestClose={() => setDeleteFoodOpen(false)}>
                    <h2>Confirm Delete Food</h2>
                    <p>Are you sure you want to delete this food from the meal?</p>
                    <button onClick={confirmDeleteFoodFromMeal}>Delete</button>
                    <button onClick={() => setDeleteFoodOpen(false)}>Cancel</button>
                </Modal>
            )}
        </div>
    );
};

export default Meals;
