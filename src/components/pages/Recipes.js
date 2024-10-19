import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes, fetchRecipe, addRecipe, deleteRecipe } from '../../features/recipesSlice';
import Recipe from '../modal/Recipe';
import ConfirmDelete from '../modal/ConfirmDelete';
import Pagination from '../misc/Pagination';
import Loading from '../misc/Loading';
import PerPage from '../misc/PerPage';

function Recipes() {
    const dispatch = useDispatch();
    const { items: recipes, loading } = useSelector(state => state.recipes);

    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [isRecipeModalOpen, setRecipeModalOpen] = useState(false);
    const [isDeleteRecipeModalOpen, setDeleteRecipeModalOpen] = useState(false);
    const [recipeToDelete, setRecipeToDelete] = useState({ id: null, name: '' });

    useEffect(() => {
        dispatch(fetchRecipes());
    }, [dispatch]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
            direction = '';
        } else {
            direction = 'ascending';
        }
        setSortConfig({ key, direction });
    };

    const sortedRecipes = [...recipes].sort((a, b) => {
        if (sortConfig.key) {
            if (sortConfig.direction === 'ascending') {
                return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
            } else if (sortConfig.direction === 'descending') {
                return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
            }
        }
        return 0;
    });

    const filteredRecipes = sortedRecipes.filter(recipe => {
        const searchLower = search.toLowerCase();
        return recipe.name.toLowerCase().includes(searchLower) ||
            recipe.recipeFoods.some(rf => rf.food.name.toLowerCase().includes(searchLower));
    });

    const paginatedRecipes = filteredRecipes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleAddRecipe = (recipeName) => {
        if (recipeName && !recipes.some(recipe => recipe.name.toLowerCase() === recipeName.toLowerCase())) {
            dispatch(addRecipe({ name: recipeName, description: '', recipeFoods: [] }));
        }
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to the first page
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);

    const openRecipeModal = (recipeId) => {
        dispatch(fetchRecipe(recipeId));
        setRecipeModalOpen(true);
    };

    const closeRecipeModal = () => {
        setRecipeModalOpen(false);
    };

    const openDeleteRecipeModal = (recipeId, recipeName) => {
        setRecipeToDelete({ id: recipeId, name: recipeName });
        setDeleteRecipeModalOpen(true);
    };

    const closeDeleteRecipeModal = () => {
        setDeleteRecipeModalOpen(false);
    };

    const handleDelete = (id) => {
        dispatch(deleteRecipe(id));
        setDeleteRecipeModalOpen(false);
    }

    return (
        <div>
            {loading ? (
                <Loading />
            ) : (
                <div>
                    <div className="header">
                        <PerPage itemsPerPage={itemsPerPage} onChange={handleItemsPerPageChange} />
                        <AddRecipe onAddRecipe={handleAddRecipe} search={search} onSearchChange={handleSearchChange} />
                    </div>
                    <RecipesTable
                        recipes={paginatedRecipes}
                        sortConfig={sortConfig}
                        onSort={handleSort}
                        onEdit={openRecipeModal}
                        onDelete={openDeleteRecipeModal}
                    />
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    <ReactModal isOpen={isRecipeModalOpen} onRequestClose={closeRecipeModal}>
                        <Recipe onClose={closeRecipeModal} />
                    </ReactModal>
                    <ReactModal isOpen={isDeleteRecipeModalOpen} onRequestClose={closeDeleteRecipeModal}>
                        <ConfirmDelete
                            name={recipeToDelete.name}
                            onConfirm={() => handleDelete(recipeToDelete.id)}
                            onCancel={closeDeleteRecipeModal}
                        />
                    </ReactModal>
                </div>
            )}
        </div>
    );
}

function AddRecipe({ search, onSearchChange, onAddRecipe }) {

    const handleAddRecipe = () => {
        onAddRecipe(search);
    };

    return (
        <div className="add-recipe-form">
            <input
                type="text"
                placeholder="Search for recipes or enter a new recipe name..."
                value={search}
                onChange={onSearchChange}
            />
            <button onClick={handleAddRecipe}>Add Recipe</button>
        </div>
    );
}

function RecipesTable({ recipes, sortConfig, onSort, onEdit, onDelete }) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th onClick={() => onSort('totalCarbs')}>
                        Total Carbs {sortConfig.key === 'totalCarbs' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => onSort('totalCalories')}>
                        Total Calories {sortConfig.key === 'totalCalories' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
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
