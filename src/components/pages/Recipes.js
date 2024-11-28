import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes, fetchRecipe, deleteRecipe, addNewRecipe } from '../../features/recipesSlice';
import ReactModal from 'react-modal';
import Recipe from '../modal/Recipe';
import ConfirmDelete from '../modal/ConfirmDelete';
import Pagination from '../misc/Pagination';
import Loading from '../misc/Loading';
import PerPage from '../misc/PerPage';
import useSorting from "../../hooks/useSorting";
import usePagination from "../../hooks/usePagination";
import useSearching from "../../hooks/useSearching";
import useModals from "../../hooks/useModals";

function Recipes() {

    const dispatch = useDispatch();
    const { items: recipes, selectedItem: recipe, loading } = useSelector(state => state.recipes);
    const { modals, openModal, closeModal } = useModals();
    const { sortConfig, handleSortChange, sort } = useSorting();
    const { pageConfig, handlePageChange, handleItemsPerPageChange, paginate } = usePagination();
    const { searchConfig, search, handleSearchChange } = useSearching();

    useEffect(() => {
        dispatch(fetchRecipes());
    }, [dispatch]);

    const filteredRecipes = search(recipes);
    const sortedRecipes = sort(filteredRecipes);
    const paginatedRecipes = paginate(sortedRecipes);

    const openRecipeModal = () => {

        openModal("editRecipe");
    };

    const closeRecipeModal = () => {

        closeModal("editRecipe");
    };

    const openDeleteRecipeModal = (recipeId, recipeName) => {

        openModal("deleteRecipe", { id: recipeId, name: recipeName });
    };

    const closeDeleteRecipeModal = () => {

        closeModal("deleteRecipe");
    };

    const handleEdit = (recipeId) => {

        dispatch(fetchRecipe(recipeId));
        openRecipeModal();
    };

    const handleDelete = (id) => {

        dispatch(deleteRecipe(id));
        closeDeleteRecipeModal();
    };

    const handleAdd = () => {

        dispatch(addNewRecipe());
        openRecipeModal();
    };

    return (
        <div>
            {loading ? (
                <Loading/>
            ) : (
                <div>
                    <RecipesHeader
                        pageConfig={pageConfig}
                        searchConfig={searchConfig}
                        handleAdd={handleAdd}
                        handleItemsPerPageChange={handleItemsPerPageChange}
                        handlePageChange={handlePageChange}
                        handleSearchChange={handleSearchChange}
                    />
                    <RecipesTable
                        recipes={paginatedRecipes}
                        sortConfig={sortConfig}
                        handlePageChange={handlePageChange}
                        handleSortChange={handleSortChange}
                        onEdit={handleEdit}
                        onDelete={openDeleteRecipeModal}
                    />
                    <Pagination
                        currentPage={pageConfig.currentPage}
                        totalPages={Math.ceil(sortedRecipes.length / pageConfig.itemsPerPage)}
                        onPageChange={handlePageChange}/>
                    <ReactModal
                        isOpen={modals.editRecipe?.isOpen}
                        onRequestClose={closeRecipeModal}
                    >
                        <Recipe
                            recipe={recipe}
                            onClose={closeRecipeModal}
                        />
                    </ReactModal>
                    <ReactModal
                        isOpen={modals.deleteRecipe?.isOpen}
                        onRequestClose={closeDeleteRecipeModal}
                    >
                        <ConfirmDelete
                            name={modals.deleteRecipe?.name}
                            onConfirm={() => handleDelete(modals.deleteRecipe?.id)}
                            onCancel={closeDeleteRecipeModal}
                        />
                    </ReactModal>
                </div>
            )}
        </div>
    );
}

function RecipesHeader({ pageConfig, searchConfig, handleAdd, handleItemsPerPageChange, handlePageChange, handleSearchChange }) {

    const [searchBy, setSearchBy] = useState("name");

    return (
        <div className="header">
            <PerPage
                itemsPerPage={pageConfig.itemsPerPage}
                onChange={handleItemsPerPageChange}
            />
            <SearchRecipes
                searchConfig={searchConfig}
                searchBy={searchBy}
                setSearchBy={setSearchBy}
                handlePageChange={handlePageChange}
                handleSearchChange={handleSearchChange}
                onAddRecipe={handleAdd}
            />
        </div>
    );
}

function SearchRecipes({ searchBy, setSearchBy, searchConfig, handlePageChange, handleSearchChange, onAddRecipe }) {

    const handleInputChange = (e) => {

        const {value} = e.target;
        handleSearchChange({[searchBy]: value});
        handlePageChange(1);
    };

    const handleSelectChange = (e) => {

        const newSearchBy = e.target.value;

        setSearchBy((prev) => {
            handleSearchChange({[prev]: ""});
            handleSearchChange({[newSearchBy]: searchConfig[newSearchBy] || ""});
            return newSearchBy;
        });
    };

    return (
        <div className="add-recipe-form">
            <select onChange={handleSelectChange} value={searchBy}>
                <option value="name">By Name</option>
                <option value="totalCarbs">By Total Carbs</option>
                <option value="totalCalories">By Total Calories</option>
                <option value="foodName">By Food Name</option>
                <option value="foodType">By Food Type</option>
            </select>
            <input
                type="text"
                placeholder="Search for recipes..."
                value={searchConfig[searchBy] || ""}
                onChange={handleInputChange}
            />
            <button onClick={() => onAddRecipe(searchConfig.name)}>New</button>
        </div>
    );
}

function RecipesTable({ recipes, sortConfig, handlePageChange, handleSortChange, onEdit, onDelete }) {

    const handleHeaderClick = (value) => {

        handleSortChange(value);
        handlePageChange(1);
    };

    return (
        <table>
            <thead>
            <tr>
                <th>Name</th>
                <th onClick={() => handleHeaderClick('totalCarbs')}>
                    Total Carbs {sortConfig.key === 'totalCarbs' ? sortConfig.icon : ''}
                </th>
                <th onClick={() => handleHeaderClick('totalCalories')}>
                    Total Calories {sortConfig.key === 'totalCalories' ? sortConfig.icon : ''}
                </th>
                <th className="description">Description</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {recipes.map(recipe => (
                <tr key={recipe.id}>
                    <td>{recipe.name}</td>
                    <td>{recipe.totalCarbs}</td>
                    <td>{recipe.totalCalories}</td>
                    <td>{recipe.description}</td>
                    <td>
                        <button onClick={() => onEdit(recipe.id)}>Edit</button>
                        <button onClick={() => onDelete(recipe.id, recipe.name)}>Delete</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default Recipes;
