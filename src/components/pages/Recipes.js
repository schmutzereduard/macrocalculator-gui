import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { fetchRecipes } from '../../store/actions/recipeActions';
import { showEditRecipeModal, hideEditRecipeModal } from '../../store/actions/modal/edit';
import { showInsertRecipeModal, hideInsertRecipeModal } from '../../store/actions/modal/insert';
import { showDeleteRecipeModal, hideDeleteRecipeModal } from '../../store/actions/modal/delete';
import InsertRecipeModal from '../modal/InsertRecipeModal';
import ViewRecipeModal from '../modal/EditRecipeModal';
import DeleteRecipeModal from '../modal/DeleteRecipeModal';

const Recipes = ({
    onEditRecipe, onCancelEditRecipe,
    onAddRecipe, onCancelAddRecipe,
    onDeleteRecipe, onCancelDeleteRecipe
}) => {
    const dispatch = useDispatch();
    const recipes = useSelector(state => state.recipes.recipes);
    const loading = useSelector(state => state.recipes.loading);
    const isEditRecipeModalOpen = useSelector(state => state.editModal.isEditRecipeModalOpen);
    const isInsertRecipeModalOpen = useSelector(state => state.insertModal.isInsertRecipeModalOpen);
    const isDeleteRecipeModalOpen = useSelector(state => state.deleteModal.isDeleteRecipeModalOpen);

    const [search, setSearch] = useState('');
    const [viewingRecipe, setViewingRecipe] = useState(null);
    const [deletingRecipe, setDeletingRecipe] = useState(null);

    useEffect(() => {
        dispatch(fetchRecipes());
    }, [dispatch]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const filteredRecipes = recipes.filter(recipe => recipe.name.toLowerCase().includes(search.toLowerCase()));

    const handleAddRecipe = () => {
        onAddRecipe();
    };

    const handleDeleteRecipe = (id) => {
        setDeletingRecipe(id);
        onDeleteRecipe();
    };

    const handleEditRecipe = (recipe) => {
        setViewingRecipe(recipe);
        onEditRecipe();
    };

    return (
        <div>
            <div className="recipe-header">
                <input
                    type="text"
                    placeholder="Search for recipes..."
                    value={search}
                    onChange={handleSearchChange}
                />
                <button onClick={handleAddRecipe}>Add Recipe</button>
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
                                <td>{recipe.totalCarbs}</td>
                                <td>{recipe.totalCalories}</td>
                                <td>
                                    <button onClick={() => handleEditRecipe(recipe)}>Edit</button>
                                    <button onClick={() => handleDeleteRecipe(recipe.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <InsertRecipeModal
                isOpen={isInsertRecipeModalOpen}
                onRequestClose={onCancelAddRecipe}
            />
            {viewingRecipe && (
                <ViewRecipeModal
                    isOpen={isEditRecipeModalOpen}
                    onRequestClose={onCancelEditRecipe}
                    recipe={viewingRecipe}
                />
            )}
            {deletingRecipe && (
                <DeleteRecipeModal
                    isOpen={isDeleteRecipeModalOpen}
                    onRequestClose={onCancelDeleteRecipe}
                    recipeId={deletingRecipe}
                />
            )}
        </div>
    );
};

const mapDispatchToProps = (dispatch) => ({
    onEditRecipe: () => dispatch(showEditRecipeModal()),
    onCancelEditRecipe: () => dispatch(hideEditRecipeModal()),
    onAddRecipe: () => dispatch(showInsertRecipeModal()),
    onCancelAddRecipe: () => dispatch(hideInsertRecipeModal()),
    onDeleteRecipe: () => dispatch(showDeleteRecipeModal()),
    onCancelDeleteRecipe: () => dispatch(hideDeleteRecipeModal())
});

export default connect(null, mapDispatchToProps)(Recipes);
