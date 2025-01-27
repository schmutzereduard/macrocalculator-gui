import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {fetchRecipe} from "../../store/recipesSlice";
import Loading from "../misc/Loading";
import RecipeFoodCard from "../cards/RecipeFoodCard";
import "./Recipe.css";
import usePagination from "../../hooks/usePagination";
import Pagination from "../misc/Pagination";
import {fetchFoods} from "../../store/foodsSlice";
import PerPage from "../misc/PerPage";
import useFiltering from "../../hooks/useFiltering";
import useModals from "../../hooks/useModals";
import KitchenFoodCard from "../cards/KitchenFoodCard";

function Recipe() {

    const [editableRecipe, setEditableRecipe] = useState(null);
    const dispatch = useDispatch();
    const { id } = useParams();
    const { loading, selectedItem: recipe } = useSelector(state => state.recipes);
    const { loading: foodsLoading, items: foods } = useSelector(state => state.foods);
    const { modals, modalControls } = useModals();

    useEffect(() => {
        if (id) {
            dispatch(fetchRecipe(id));
            dispatch(fetchFoods());
        }
    }, [dispatch, id]);


    useEffect(() => {
        if (recipe) {
            setEditableRecipe({...recipe});
        }
    }, [recipe]);


    return loading ? (
                <Loading />
            ) : ( editableRecipe &&
        <div>
            <div className="recipe stats-bar">
                <input className="recipe-name" value={editableRecipe.name} />
                <div className="stats">
                    <p>{editableRecipe.totalCarbs} carbs</p>
                    <p> | </p>
                    <p>{0} protein</p>
                    <p> | </p>
                    <p>{0} fat</p>
                    <p> | </p>
                    <p>{editableRecipe.totalCalories} kcal</p>
                    <p> | </p>
                    <p>{editableRecipe.totalWeight} g</p>
                </div>
                <div className="controls">
                    <button className="back">Back</button>
                    <button className="save">Save</button>
                </div>
            </div>
            <div className="recipe food-list">
                {editableRecipe.recipeFoods.map((recipeFood) => (
                    <RecipeFoodCard
                        quantity={recipeFood.quantity}
                        food={recipeFood.food}
                    />
                ))}
            </div>
            <Kitchen
                editableRecipe={editableRecipe}
                foods={foods}
            />

        </div>
    );
}

function Kitchen ({ editableRecipe, foods }) {

    const { pageConfig, handlePageChange, handleItemsPerPageChange, paginate } = usePagination();
    const { filterConfig, handleFilterChange, filter } = useFiltering();

    const mapFoodsToName = () => {
        return editableRecipe.recipeFoods.map(recipeFood => recipeFood.food.name);
    };

    const newFoods = foods.filter(food => !mapFoodsToName().includes(food.name));
    const filteredFoods = filter(newFoods);
    const paginatedFoods = paginate(filteredFoods);

    return (
        <div className="kitchen">
            <div className="kitchen stats-bar">
                <FoodsHeader
                    filterConfig={filterConfig}
                    pageConfig={pageConfig}
                    handleFilterChange={handleFilterChange}
                    handlePageChange={handlePageChange}
                    handleItemsPerPageChange={handleItemsPerPageChange}
                />
                <div className="stats">
                    <p>{editableRecipe.totalCarbs} carbs</p>
                    <p> | </p>
                    <p>{0} protein</p>
                    <p> | </p>
                    <p>{0} fat</p>
                    <p> | </p>
                    <p>{editableRecipe.totalCalories} kcal</p>
                    <p> | </p>
                    <p>{editableRecipe.totalWeight} g</p>
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
                        food={food}
                    />
                ))}
            </div>
        </div>
    );
}

function FoodsHeader({
                         filterConfig,
                         pageConfig,
                         handleFilterChange,
                         handlePageChange,
                         handleItemsPerPageChange
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
        </div>
    );
}

export default Recipe;