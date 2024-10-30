import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes, fetchRecipe, addRecipe, deleteRecipe } from '../../features/recipesSlice';
import Recipe from '../modal/Recipe';
import ConfirmDelete from '../modal/ConfirmDelete';
import Pagination from '../misc/Pagination';
import Loading from '../misc/Loading';
import PerPage from '../misc/PerPage';
import useModals from "../../hooks/useModals";
import useSorting from "../../hooks/useSorting";
import usePagination from "../../hooks/usePagination";
import useSearching from "../../hooks/useSearching";

function Recipes() {
    const dispatch = useDispatch();
    const { items: recipes, loading } = useSelector(state => state.recipes);
    const { modalConfig, setModalConfig } = useModals();
    const { sortConfig, handleSortChange, sort } = useSorting();
    const { pageConfig, handlePageChange, handleItemsPerPageChange, paginate } = usePagination();
    const { searchConfig, search, handleSearchChange } = useSearching({
        name: ''
    });

    useEffect(() => {
        dispatch(fetchRecipes());
    }, [dispatch]);

    const filteredRecipes = search(recipes);
    const sortedRecipes = sort(filteredRecipes);
    const paginatedRecipes = paginate(sortedRecipes);

    const openRecipeModal = (recipeId) => {
        dispatch(fetchRecipe(recipeId));
        setModalConfig({
            ...modalConfig,
            isItemModalOpen: true
        });
    };

    const closeRecipeModal = () => {
        setModalConfig({
            ...modalConfig,
            isItemModalOpen: false
        });
    };

    const openDeleteRecipeModal = (recipeId, recipeName) => {
        setModalConfig({
            ...modalConfig,
            isDeleteItemModalOpen: true,
            itemToDelete: {
                id: recipeId,
                name: recipeName
            }
        });
    };

    const closeDeleteRecipeModal = () => {
        setModalConfig({
            ...modalConfig,
            isDeleteItemModalOpen: false,
            itemToDelete: {
                id: null,
                name: null
            }
        });
    };

    const handleDelete = (id) => {
        dispatch(deleteRecipe(id));
        closeDeleteRecipeModal();
    };

    const handleAdd = (recipeName) => {
        if (recipeName && !recipes.some(recipe => recipe.name.toLowerCase() === recipeName.toLowerCase())) {
            dispatch(addRecipe({ name: recipeName, description: '', recipeFoods: [] }));
        }
    };

    return (
        <div>
            {loading ? (
                <Loading />
            ) : (
                <div>
                    <div className="header">
                        <PerPage
                            itemsPerPage={pageConfig.itemsPerPage}
                            onChange={handleItemsPerPageChange}
                        />
                        <AddRecipe
                            searchConfig={searchConfig}
                            handlePageChange={handlePageChange}
                            handleSearchChange={handleSearchChange}
                            onAddRecipe={handleAdd}
                        />
                    </div>
                    <RecipesTable
                        recipes={paginatedRecipes}
                        sortConfig={sortConfig}
                        handlePageChange={handlePageChange}
                        handleSortChange={handleSortChange}
                        onEdit={openRecipeModal}
                        onDelete={openDeleteRecipeModal}
                    />
                    <Pagination
                        currentPage={pageConfig.currentPage}
                        totalPages={Math.ceil(sortedRecipes.length / pageConfig.itemsPerPage)}
                        onPageChange={handlePageChange} />
                    <ReactModal
                        isOpen={modalConfig.isItemModalOpen}
                        onRequestClose={closeRecipeModal}
                    >
                        <Recipe
                            onClose={closeRecipeModal}
                        />
                    </ReactModal>
                    <ReactModal
                        isOpen={modalConfig.isDeleteItemModalOpen}
                        onRequestClose={closeDeleteRecipeModal}
                    >
                        <ConfirmDelete
                            name={modalConfig.itemToDelete.name}
                            onConfirm={() => handleDelete(modalConfig.itemToDelete.id)}
                            onCancel={closeDeleteRecipeModal}
                        />
                    </ReactModal>
                </div>
            )}
        </div>
    );
}

function AddRecipe({ searchConfig, handlePageChange, handleSearchChange, onAddRecipe }) {

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        handleSearchChange({ [name]: value });
        handlePageChange(1);
    };

    return (
        <div className="add-recipe-form">
            <input
                name="name"
                type="text"
                placeholder="Search for recipes or enter a new recipe name..."
                value={searchConfig.name}
                onChange={handleInputChange}
            />
            <button onClick={() => onAddRecipe(searchConfig.name)}>+</button>
        </div>
    );
}

function RecipesTable({ recipes, sortConfig,handlePageChange, handleSortChange, onEdit, onDelete }) {

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
