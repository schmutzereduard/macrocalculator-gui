import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';
import { fetchRecipes, addRecipe, deleteRecipe } from '../../store/actions/recipeActions';
import { showEditRecipeModal, hideEditRecipeModal } from '../../store/actions/modal/edit';
import { showDeleteRecipeModal, hideDeleteRecipeModal } from '../../store/actions/modal/delete';
import ViewRecipeModal from '../modal/EditRecipeModal';
import ConfirmDeleteModal from '../modal/ConfirmDeleteModal';

const Recipes = ({
    onEditRecipe, onCancelEditRecipe,
    onDeleteRecipe, onCancelDeleteRecipe
}) => {
    const dispatch = useDispatch();
    const recipes = useSelector(state => state.recipes.recipes);
    const loading = useSelector(state => state.recipes.loading);
    const isEditRecipeModalOpen = useSelector(state => state.editModal.isEditRecipeModalOpen);
    const isDeleteRecipeModalOpen = useSelector(state => state.deleteModal.isDeleteRecipeModalOpen);

    const [search, setSearch] = useState('');
    const [viewingRecipe, setViewingRecipe] = useState(null);
    const [deletingRecipe, setDeletingRecipe] = useState(null);
    const [descriptionModalIsOpen, setDescriptionModalIsOpen] = useState(false);
    const [descriptionToView, setDescriptionToView] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        dispatch(fetchRecipes());
    }, [dispatch]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);  // Reset to the first page on search
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

    const handleAddRecipe = () => {
        if (search && !recipes.some(recipe => recipe.name.toLowerCase() === search.toLowerCase())) {
            dispatch(addRecipe({ name: search, description: '', recipeFoods: [] }));
            setSearch('');
        }
    };

    const handleDeleteRecipe = (id) => {
        setDeletingRecipe(id);
        onDeleteRecipe();
    };

    const handleEditRecipe = (recipe) => {
        setViewingRecipe(recipe);
        onEditRecipe();
    };

    const openDescriptionModal = (description) => {
        setDescriptionToView(description);
        setDescriptionModalIsOpen(true);
    };

    const closeDescriptionModal = () => {
        setDescriptionModalIsOpen(false);
        setDescriptionToView('');
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);  // Reset to the first page
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const confirmDeleteRecipe = () => {
        dispatch(deleteRecipe(deletingRecipe));
        onCancelDeleteRecipe();
    };

    const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);

    return (
        <div>
            <div className="recipe-header header">
                <input
                    type="text"
                    placeholder="Search for recipes or enter a new recipe name..."
                    value={search}
                    onChange={handleSearchChange}
                />
                <button onClick={handleAddRecipe}>Add Recipe</button>
                <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th onClick={() => handleSort('totalCarbs')}>
                                Total Carbs {sortConfig.key === 'totalCarbs' && (sortConfig.direction === 'ascending' ? '↑' : sortConfig.direction === 'descending' ? '↓' : '')}
                            </th>
                            <th onClick={() => handleSort('totalCalories')}>
                                Total Calories {sortConfig.key === 'totalCalories' && (sortConfig.direction === 'ascending' ? '↑' : sortConfig.direction === 'descending' ? '↓' : '')}
                            </th>
                            <th className="description">Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedRecipes.map(recipe => (
                            <tr key={recipe.id}>
                                <td>{recipe.name}</td>
                                <td>{recipe.totalCarbs}</td>
                                <td>{recipe.totalCalories}</td>
                                <td className="description">
                                    {recipe.description && recipe.description.length > 100 ? (
                                        <>
                                            {recipe.description.substring(0, 100)}...
                                            <button onClick={() => openDescriptionModal(recipe.description)}>View</button>
                                        </>
                                    ) : (
                                        recipe.description
                                    )}
                                </td>
                                <td>
                                    <button onClick={() => handleEditRecipe(recipe)}>Edit</button>
                                    <button onClick={() => handleDeleteRecipe(recipe.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={page === currentPage ? 'active' : ''}
                    >
                        {page}
                    </button>
                ))}
            </div>
            {viewingRecipe && (
                <ViewRecipeModal
                    isOpen={isEditRecipeModalOpen}
                    onRequestClose={onCancelEditRecipe}
                    recipe={viewingRecipe}
                />
            )}
            {deletingRecipe && (
                <ConfirmDeleteModal
                isOpen={isDeleteRecipeModalOpen}
                onRequestClose={onCancelDeleteRecipe}
                onConfirm={confirmDeleteRecipe}
                message="Are you sure you want to delete this recipe?"
            />
            )}

            <Modal
                isOpen={descriptionModalIsOpen}
                onRequestClose={closeDescriptionModal}
                contentLabel="Description Modal"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '50%',
                        padding: '20px'
                    }
                }}
            >
                <h2>Description</h2>
                <p>{descriptionToView}</p>
                <button onClick={closeDescriptionModal}>Close</button>
            </Modal>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => ({
    onEditRecipe: () => dispatch(showEditRecipeModal()),
    onCancelEditRecipe: () => dispatch(hideEditRecipeModal()),
    onDeleteRecipe: () => dispatch(showDeleteRecipeModal()),
    onCancelDeleteRecipe: () => dispatch(hideDeleteRecipeModal())
});

export default connect(null, mapDispatchToProps)(Recipes);
