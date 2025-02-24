import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import useModals from "../../hooks/useModals";
import useFiltering from "../../hooks/useFiltering";
import {addNewRecipe, addRecipe, fetchRecipe, updateRecipe} from "../../store/recipesSlice";
import {fetchFoods, fetchFoodTypes} from "../../store/foodsSlice";
import Loading from "../misc/Loading";
import RecipeFoodCard from "../cards/RecipeFoodCard";
import KitchenFoodCard from "../cards/KitchenFoodCard";
import usePagination from "../../hooks/usePagination";
import Pagination from "../misc/Pagination";
import PerPage from "../misc/PerPage";
import "./Recipe.css";
import FoodFilter from "../modal/FoodFilter";
import ReactModal from "react-modal";
import SaveChanges from "../modal/SaveChanges";

function Recipe() {

    const navigate = useNavigate();
    const [editableRecipe, setEditableRecipe] = useState(null);
    const dispatch = useDispatch();
    const { id } = useParams();
    const { loading, selectedItem: recipe } = useSelector(state => state.recipes);
    const { modals, modalControls } = useModals();

    useEffect(() => {
        if (id !== "0") {
            dispatch(fetchRecipe(id));
        } else if (id === "0") {
            dispatch(addNewRecipe());
        }
        dispatch(fetchFoods());
        dispatch(fetchFoodTypes());
    }, [dispatch, id]);


    useEffect(() => {
        if (recipe) {
            setEditableRecipe({...recipe});
        }
    }, [recipe]);

    const [stats, setStats] = useState({
        carbs: 0,
        protein: 0,
        calories: 0,
        fat: 0,
        weight: 0,
    });

    useEffect(() => {
        if (editableRecipe != null) {
            const newStats = {
                carbs: 0,
                protein: 0,
                calories: 0,
                fat: 0,
                weight: 0,
            };

            editableRecipe.recipeFoods.forEach(recipeFood => {
                const quantity = recipeFood.quantity;
                const food = recipeFood.food;
                newStats.weight += parseInt(quantity);
                newStats.carbs += (quantity / 100) * food.carbs;
                // newStats.protein += foodQuantity / 100 * food.protein;
                newStats.calories += (quantity / 100) * food.calories;
                // newStats.fat += foodQuantity / 100 * food.fat;
            });

            setStats(newStats);
        }
    }, [editableRecipe]);

    const recipeValid = () => {

        return editableRecipe
            && editableRecipe.name;
    };

    const recipeChanged = () => {

        for (let key in editableRecipe) {
            if (editableRecipe[key] !== recipe[key]) return true;
        }
        return false;
    };

    const handleAddFood = (quantity, food) => {
        const newFood = {
            quantity: quantity,
            food: food,
        }
        const recipeFoods = [
            ...editableRecipe.recipeFoods,
            newFood
        ]

        setEditableRecipe({
            ...editableRecipe,
            recipeFoods: recipeFoods
        });
    };

    const handleDeleteFood = (foodId) => {
        const recipeFoods = editableRecipe.recipeFoods.filter(recipeFood => recipeFood.food.id !== foodId);
        setEditableRecipe({
            ...editableRecipe,
            recipeFoods: recipeFoods
        });
    };

    const handleEditFood = (quantity, food) => {
        setEditableRecipe((prevState) => {
            const oldFood = prevState.recipeFoods.find(recipeFood => recipeFood.food.id === food.id);
            const newFood = {
                ...oldFood,
                quantity: quantity,
            }
            const updatedFoods = prevState.recipeFoods.map(recipeFood => recipeFood.food.id === oldFood.food.id ? newFood: recipeFood);
            return {
                ...prevState,
                recipeFoods: updatedFoods
            };
        });
    };

    const handleSave = () => {

        if (recipeChanged()) {
            onSave();
        }
    };

    const handleBack = () => {

        if (recipeChanged() && recipeValid()) {
            modalControls.openModal("saveChanges");
        } else {
            onExit();
        }
    };

    const onSave = async () => {

        if (!recipe.id){
            await dispatch(addRecipe(editableRecipe));
        } else {
            await dispatch(updateRecipe(editableRecipe));
        }
        navigate("/recipes");
    };

    const onExit = () => {

        modalControls.closeModal("saveChanges");
        navigate("/recipes");
    };


    return loading ? (
                <Loading />
            ) : ( editableRecipe &&
        <div>
            <div className="recipe stats-bar">
                <input
                    name="name"
                    className="recipe-name"
                    value={editableRecipe.name}
                    onChange={(e) => setEditableRecipe((prev) => ({...prev, [e.target.name]: e.target.value}))}
                />
                <div className="stats">
                    <p>{stats.carbs} carbs</p>
                    <p> | </p>
                    <p>{stats.protein} protein</p>
                    <p> | </p>
                    <p>{stats.fat} fat</p>
                    <p> | </p>
                    <p>{stats.calories} kcal</p>
                    <p> | </p>
                    <p>{stats.weight} g</p>
                </div>
                <div className="controls">
                    <button onClick={handleBack} className="back">Back</button>
                    <button onClick={handleSave} className="save">Save</button>
                </div>
            </div>
            <div className="recipe food-list">
                {editableRecipe.recipeFoods.map((recipeFood) => (
                    <RecipeFoodCard
                        quantity={recipeFood.quantity}
                        onQuantityUpdate={handleEditFood}
                        food={recipeFood.food}
                        onDelete={handleDeleteFood}
                    />
                ))}
            </div>
            <Kitchen
                editableRecipe={editableRecipe}
                onAddFood={handleAddFood}
            />
            <ReactModal
                isOpen={modals.saveChanges?.isOpen}
                onRequestClose={onExit}
                style={{
                    overlay: {
                        backgroundColor: "transparent" // Remove grey background
                    },
                    content: {
                        background: "none", // Ensures no default modal styles
                        border: "none", // Removes any unwanted modal border
                        inset: "unset", // Prevents ReactModal from forcing a layout
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }
                }}
            >
                <SaveChanges
                    onSave={onSave}
                    onExit={onExit}
                />
            </ReactModal>
        </div>
    );
}

function Kitchen ({ editableRecipe, onAddFood }) {

    const [foodsToQuantity, setFoodsToQuantity] = useState({});
    const { loading: foodsLoading, items: foods } = useSelector(state => state.foods);
    const { pageConfig, handlePageChange, handleItemsPerPageChange, paginate } = usePagination();
    const { filterConfig, handleFilterChange, filter } = useFiltering();

    const existingRecipeFoods = () => {
        return editableRecipe.recipeFoods.map(recipeFood => recipeFood.food.name);
    };

    const newFoods = foods.filter(food => !existingRecipeFoods().includes(food.name));
    const filteredFoods = filter(newFoods);
    const paginatedFoods = paginate(filteredFoods);

    const setFoodQuantity = (food) => {
        setFoodsToQuantity((prev) => ({
            ...prev,
            ...food
        }));
    };

    const [stats, setStats] = useState({
        carbs: 0,
        protein: 0,
        calories: 0,
        fat: 0,
        weight: 0,
    });

    useEffect(() => {
        const calculateStats = () => {
            const newStats = {
                carbs: 0,
                protein: 0,
                calories: 0,
                fat: 0,
                weight: 0,
            };

            for (let foodId in foodsToQuantity) {
                const foodQuantity = foodsToQuantity[foodId];
                if (foodQuantity > 0) {
                    const food = foods.find(food => food.id === parseInt(foodId));
                    newStats.weight += parseInt(foodQuantity);
                    newStats.carbs += (foodQuantity / 100) * food.carbs;
                    // newStats.protein += foodQuantity / 100 * food.protein;
                    newStats.calories += (foodQuantity / 100) * food.calories;
                    // newStats.fat += foodQuantity / 100 * food.fat;
                }
            }

            setStats(newStats);
        };

        calculateStats();
    }, [foodsToQuantity, foods]);

    const onAdd = (quantity, food) => {
        setFoodsToQuantity((prev) => {
            const newFoodsToQuantity = { ...prev };
            delete newFoodsToQuantity[food.id]; // Remove the food by ID
            return newFoodsToQuantity;
        });
      onAddFood(quantity, food);
    };

    return (foodsLoading ? <Loading />
        : (<div className="kitchen">
            <div className="kitchen stats-bar">
                <FoodsHeader
                    filterConfig={filterConfig}
                    pageConfig={pageConfig}
                    handleFilterChange={handleFilterChange}
                    handlePageChange={handlePageChange}
                    handleItemsPerPageChange={handleItemsPerPageChange}
                    filteredFoods={filteredFoods}
                />
                <div className="stats"
                >
                    <p>{stats.carbs} carbs</p>
                    <p> | </p>
                    <p>{stats.protein} protein</p>
                    <p> | </p>
                    <p>{stats.fat} fat</p>
                    <p> | </p>
                    <p>{stats.calories} kcal</p>
                    <p> | </p>
                    <p>{stats.weight} g</p>
                </div>
                <Pagination
                    currentPage={pageConfig.currentPage}
                    totalPages={Math.ceil(filteredFoods.length / pageConfig.itemsPerPage)}
                    onPageChange={handlePageChange}
                />
            </div>
            <div className="food-list">
                {foods &&
                    paginatedFoods
                        .map((food) => (
                    <KitchenFoodCard
                        key={food.id}
                        food={food}
                        setFoodQuantity={setFoodQuantity}
                        quantity={foodsToQuantity[food.id] || 0}
                        onAdd={onAdd}
                    />
                ))}
            </div>
        </div>)
    );
}

function FoodsHeader({
                         filterConfig,
                         pageConfig,
                         handleFilterChange,
                         handlePageChange,
                         handleItemsPerPageChange, filteredFoods
                     }) {

    const { modals, modalControls } = useModals();

    const handleSearch = (e) => {

        const {name, value} = e.target;
        handleFilterChange({...filterConfig, [name]: value});
        handlePageChange(1);
    };

    return (
        <div className="foods-header">
            <PerPage
                itemsPerPage={pageConfig.itemsPerPage}
                onChange={handleItemsPerPageChange}
            />
            <input
                className="search-bar"
                type="text"
                placeholder="Search a food by name..."
                name="name"
                value={filterConfig.name || ""}
                onChange={handleSearch}
            />
            <button
                onClick={() => modalControls.openModal("filterFoods")}
                className="filter-button"
            >
                Filter
            </button>

            <ReactModal isOpen={modals.filterFoods?.isOpen}>
                <FoodFilter
                    filterConfig={filterConfig}
                    handleFilterChange={handleFilterChange}
                    handlePageChange={handlePageChange}
                    totalItems={filteredFoods.length}
                    onClose={() => modalControls.closeModal("filterFoods")}
                />
            </ReactModal>
        </div>
    );
}

export default Recipe;