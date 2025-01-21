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
import PlusCard from "../cards/PlusCard";
import FoodCard from "../cards/FoodCard";

function Recipe() {

    const dispatch = useDispatch();
    const { id } = useParams();
    const { loading, selectedItem: recipe } = useSelector(state => state.recipes);
    const { loading: foodsLoading, items: foods } = useSelector(state => state.foods);
    const [editableRecipe, setEditableRecipe] = useState(null);
    const { pageConfig, handlePageChange, handleItemsPerPageChange, paginate } = usePagination();
    const { filterConfig, handleFilterChange, filter } = useFiltering();
    const { modals, modalControls } = useModals();

    useEffect(() => {
        if (id) {
            dispatch(fetchRecipe(id));
            dispatch(fetchFoods());
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (recipe !== null) {
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
            <div className={"recipe food-list"}>
                {editableRecipe.recipeFoods.map((recipeFood) => (
                    <RecipeFoodCard
                        recipeFood={recipeFood}
                    />
                ))}
            </div>
            <FoodsHeader
                filterConfig={filterConfig}
                pageConfig={pageConfig}
                handleFilterChange={handleFilterChange}
                handlePageChange={handlePageChange}
                handleItemsPerPageChange={handleItemsPerPageChange}
                modalControls={modalControls}
            />
            <Pagination
                currentPage={pageConfig.currentPage}
                totalPages={Math.ceil(foods.length / pageConfig.itemsPerPage)}
                onPageChange={handlePageChange}
            />
            <div className="food-list">
                {foods.map((food) => (
                    <FoodCard
                        key={food.id}
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
                         handleItemsPerPageChange,
                         modalControls
                     }) {

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