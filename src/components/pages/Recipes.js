import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {fetchRecipes} from '../../store/recipesSlice';
import Pagination from '../misc/Pagination';
import Loading from '../misc/Loading';
import PerPage from '../misc/PerPage';
import usePagination from "../../hooks/usePagination";
import useFiltering from "../../hooks/useFiltering";
import useModals from "../../hooks/useModals";
import RecipeCard from "../cards/RecipeCard";
import "./Recipes.css";
import PlusCard from "../cards/PlusCard";
import ReactModal from "react-modal";
import RecipeFilter from "../modal/RecipeFilter";
import {useNavigate} from "react-router-dom";

function Recipes() {

    const dispatch = useDispatch();
    const { items: recipes, loading } = useSelector(state => state.recipes);
    const { modals, modalControls } = useModals();
    const { pageConfig, handlePageChange, handleItemsPerPageChange, paginate } = usePagination();
    const { filterConfig, filter, handleFilterChange } = useFiltering();

    useEffect(() => {
        dispatch(fetchRecipes());
    }, [dispatch]);

    const filteredRecipes = filter(recipes);
    const paginatedRecipes = paginate(filteredRecipes);

    return loading ? (
                <Loading/>
            ) : (
                <div>
                    <RecipesHeader
                        pageConfig={pageConfig}
                        filterConfig={filterConfig}
                        handleItemsPerPageChange={handleItemsPerPageChange}
                        handlePageChange={handlePageChange}
                        handleFilterChange={handleFilterChange}
                        modalControls={modalControls}
                    />
                    <Pagination
                        currentPage={pageConfig.currentPage}
                        totalPages={Math.ceil(filteredRecipes.length / pageConfig.itemsPerPage)}
                        onPageChange={handlePageChange}
                    />
                    <RecipesList recipes={paginatedRecipes} />

                    <ReactModal isOpen={modals.filterRecipes?.isOpen}>
                        <RecipeFilter
                            filterConfig={filterConfig}
                            handleFilterChange={handleFilterChange}
                            handlePageChange={handlePageChange}
                            totalItems={filteredRecipes.length}
                            onClose={() => modalControls.closeModal("filterRecipes")}
                        />
                    </ReactModal>
                </div>
                );
}

function RecipesHeader({
                           pageConfig,
                           filterConfig,
                           handleItemsPerPageChange,
                           handlePageChange,
                           handleFilterChange,
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
                placeholder="Search a recipe by name..."
                name="name"
                value={filterConfig.name || ""}
                onChange={handleSearch}
            />
            <button
                onClick={() => modalControls.openModal("filterRecipes")}
                className="filter-button"
            >
                Filter
            </button>
        </div>
    );
}

function RecipesList({ recipes }) {

    const navigate = useNavigate();

    return (
        <div className="recipes-list">
            <PlusCard onClick={() => navigate("/recipe/0")} />
            {recipes.map((recipe) => (
                <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                />
            ))}
        </div>
    );
}

export default Recipes;
