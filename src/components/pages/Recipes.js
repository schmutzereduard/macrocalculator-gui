import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes, addRecipe, updateRecipe, deleteRecipe } from '../../store/actions/recipeActions';
import { fetchFoods } from '../../store/actions/foodActions';
import Modal from 'react-modal';

const Recipes = () => {
    const dispatch = useDispatch();
    const recipes = useSelector(state => state.recipes.recipes);
    const foods = useSelector(state => state.foods.foods);
    const loading = useSelector(state => state.recipes.loading);
    const [search, setSearch] = useState('');
    const [viewRecipe, setViewRecipe] = useState(null);
    const [isAddRecipeOpen, setAddRecipeOpen] = useState(false);
    const [newRecipeName, setNewRecipeName] = useState('');
    const [selectedFoods, setSelectedFoods] = useState([]);
    const [isDeleteRecipeOpen, setDeleteRecipeOpen] = useState(false);
    const [deletingRecipe, setDeletingRecipe] = useState(null);
    const [isAddFoodOpen, setAddFoodOpen] = useState(false);
    const [isDeleteFoodOpen, setDeleteFoodOpen] = useState(false);
    const [deletingFood, setDeletingFood] = useState(null);

    useEffect(() => {
        dispatch(fetchRecipes());
        dispatch(fetchFoods());
    }, [dispatch]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const filteredRecipes = recipes.filter(recipe => recipe.name.toLowerCase().includes(search.toLowerCase()));

    const toggleViewRecipe = (recipe) => {
        setViewRecipe(viewRecipe ? null : recipe);
    };

    const handleDeleteRecipe = (recipe) => {
        setDeletingRecipe(recipe);
        setDeleteRecipeOpen(true);
    };

    const confirmDeleteRecipe = () => {
        dispatch(deleteRecipe(deletingRecipe.id));
        setDeleteRecipeOpen(false);
        setDeletingRecipe(null);
    };

    const handleAddRecipe = () => {
        const recipe = {
            name: newRecipeName,
            foods: selectedFoods
        };
        dispatch(addRecipe(recipe));
        setAddRecipeOpen(false);
        setNewRecipeName('');
        setSelectedFoods([]);
    };

    const handleAddFoodToRecipe = (food) => {
        const updatedRecipe = {
            ...viewRecipe,
            foods: [...viewRecipe.foods, food]
        };
        dispatch(updateRecipe(updatedRecipe));
        setViewRecipe(updatedRecipe);
        setAddFoodOpen(false);
    };

    const handleRemoveFoodFromRecipe = (foodId) => {
        setDeletingFood(foodId);
        setDeleteFoodOpen(true);
    };

    const confirmDeleteFoodFromRecipe = () => {
        const updatedRecipe = {
            ...viewRecipe,
            foods: viewRecipe.foods.filter(food => food.id !== deletingFood)
        };
        dispatch(updateRecipe(updatedRecipe));
        setViewRecipe(updatedRecipe);
        setDeleteFoodOpen(false);
        setDeletingFood(null);
    };

    const availableFoods = foods.filter(food => !viewRecipe?.foods.some(recipeFood => recipeFood.id === food.id));

    return (
        <div>
            <div className="recipe-header">
                <input
                    type="text"
                    placeholder="Search for recipes..."
                    value={search}
                    onChange={handleSearchChange}
                />
                <button onClick={() => setAddRecipeOpen(true)}>Add Recipe</button>
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
                        {filteredRecipes.map(recipe => (
                            <tr key={recipe.id}>
                                <td>{recipe.name}</td>
                                <td>{recipe.foods.reduce((acc, food) => acc + food.carbs, 0)}</td>
                                <td>{recipe.foods.reduce((acc, food) => acc + food.calories, 0)}</td>
                                <td>
                                    <button onClick={() => toggleViewRecipe(recipe)}>
                                        {viewRecipe && viewRecipe.id === recipe.id ? 'Close' : 'View'}
                                    </button>
                                    <button onClick={() => handleDeleteRecipe(recipe)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {viewRecipe && (
                <Modal isOpen={!!viewRecipe} onRequestClose={() => setViewRecipe(null)}>
                    <h2>{viewRecipe.name}</h2>
                    <ul>
                        {viewRecipe.foods.map(food => (
                            <li key={food.id}>
                                {food.name} - Carbs: {food.carbs} - Calories: {food.calories}
                                <button onClick={() => handleRemoveFoodFromRecipe(food.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setAddFoodOpen(true)}>Add Food</button>
                    <button onClick={() => setViewRecipe(null)}>Close</button>
                </Modal>
            )}
            <Modal isOpen={isAddRecipeOpen} onRequestClose={() => setAddRecipeOpen(false)}>
                <h2>Add Recipe</h2>
                <input
                    type="text"
                    placeholder="Recipe name"
                    value={newRecipeName}
                    onChange={(e) => setNewRecipeName(e.target.value)}
                />
                <button disabled={selectedFoods.length === 0} onClick={handleAddRecipe}>Add Recipe</button>
                <button onClick={() => setAddRecipeOpen(false)}>Close</button>
                <h3>Selected Foods</h3>
                <ul>
                    {selectedFoods.map(food => (
                        <li key={food.id}>
                            {food.name} - Carbs: {food.carbs} - Calories: {food.calories}
                            <button onClick={() => handleRemoveFoodFromRecipe(food.id)}>Remove</button>
                        </li>
                    ))}
                </ul>
                <h3>Add Food</h3>
                <ul>
                    {availableFoods.map(food => (
                        <li key={food.id}>
                            {food.name} - Carbs: {food.carbs} - Calories: {food.calories}
                            <button onClick={() => handleAddFoodToRecipe(food)}>Add</button>
                        </li>
                    ))}
                </ul>
            </Modal>
            {deletingRecipe && (
                <Modal isOpen={isDeleteRecipeOpen} onRequestClose={() => setDeleteRecipeOpen(false)}>
                    <h2>Confirm Delete</h2>
                    <p>Are you sure you want to delete this recipe?</p>
                    <button onClick={confirmDeleteRecipe}>Delete</button>
                    <button onClick={() => setDeleteRecipeOpen(false)}>Cancel</button>
                </Modal>
            )}
            {viewRecipe && (
                <Modal isOpen={isAddFoodOpen} onRequestClose={() => setAddFoodOpen(false)}>
                    <h2>Add Food to {viewRecipe.name}</h2>
                    <ul>
                        {availableFoods.map(food => (
                            <li key={food.id}>
                                {food.name} - Carbs: {food.carbs} - Calories: {food.calories}
                                <button onClick={() => handleAddFoodToRecipe(food)}>Add</button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setAddFoodOpen(false)}>Close</button>
                </Modal>
            )}
            {deletingFood && (
                <Modal isOpen={isDeleteFoodOpen} onRequestClose={() => setDeleteFoodOpen(false)}>
                    <h2>Confirm Delete Food</h2>
                    <p>Are you sure you want to delete this food from the recipe?</p>
                    <button onClick={confirmDeleteFoodFromRecipe}>Delete</button>
                    <button onClick={() => setDeleteFoodOpen(false)}>Cancel</button>
                </Modal>
            )}
        </div>
    );
};

export default Recipes;
