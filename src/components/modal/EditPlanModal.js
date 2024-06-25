import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { fetchRecipes } from '../../store/actions/recipeActions';
import { addPlan, updatePlan, deletePlan } from '../../store/actions/planActions';
import ConfirmDeleteModal from '../modal/ConfirmDeleteModal';
import ConfirmSaveModal from '../modal/ConfirmSaveModal';
import EditRecipeModal from '../modal/EditRecipeModal';
import {
    showSavePlanChangesModal,
    hideSavePlanChangesModal
} from '../../store/actions/modal/insert';
import {
    showDeleteRecipeModal,
    hideDeleteRecipeModal,
    showDeletePlanModal,
    hideDeletePlanModal
} from '../../store/actions/modal/delete';
import {
    hideEditPlanModal,
    showEditRecipeModal,
    hideEditRecipeModal
} from '../../store/actions/modal/edit';

class EditPlanModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editingPlan: props.plan || { date: '', notes: '', recipes: [] },
            search: '',
            filteredRecipes: [],
            recipeToRemove: null,
            changesMade: false,
            recipeToEdit: null,
        };
    }

    componentDidMount() {
        if (this.props.isOpen) {
            this.props.fetchRecipes();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.plan !== this.props.plan) {
            this.setState({
                editingPlan: this.props.plan || { date: '', notes: '', recipes: [] },
                changesMade: false,
            });
        }
        
        if (prevProps.allRecipes !== this.props.allRecipes) {
            this.updateRecipeInfo();
        }
    }

    updateRecipeInfo = () => {
        const updatedRecipes = this.state.editingPlan.recipes.map(recipe => {
            const updatedRecipe = this.props.allRecipes.find(r => r.id === recipe.id);
            return updatedRecipe ? { ...recipe, ...updatedRecipe } : recipe;
        });

        this.setState({
            editingPlan: { ...this.state.editingPlan, recipes: updatedRecipes },
        });
    };

    handleSearchChange = (e) => {
        const search = e.target.value.toLowerCase();
        const filtered = this.props.allRecipes.filter(
            recipe => recipe.name.toLowerCase().includes(search) && !this.state.editingPlan.recipes.some(r => r.id === recipe.id)
        );
        this.setState({ search, filteredRecipes: filtered });
    };

    handleAddRecipe = (recipe) => {
        const updatedRecipes = [...this.state.editingPlan.recipes, recipe];
        this.setState({
            editingPlan: { ...this.state.editingPlan, recipes: updatedRecipes },
            search: '',
            filteredRecipes: [],
            changesMade: true,
        });
    };

    handleRemoveRecipe = (recipeId) => {
        this.setState({ recipeToRemove: recipeId });
        this.props.showDeleteRecipeModal();
    };

    confirmRemoveRecipe = () => {
        const updatedRecipes = this.state.editingPlan.recipes.filter(recipe => recipe.id !== this.state.recipeToRemove);
        this.setState({
            editingPlan: { ...this.state.editingPlan, recipes: updatedRecipes },
            recipeToRemove: null,
            changesMade: true,
        });
        this.props.hideDeleteRecipeModal();
    };

    handleNotesChange = (e) => {
        this.setState({ editingPlan: { ...this.state.editingPlan, notes: e.target.value }, changesMade: true });
    };

    handleUpdatePlan = () => {
        const { editingPlan } = this.state;
        if (this.props.plan.id) {
            this.props.updatePlan(editingPlan);
        } else {
            this.props.addPlan(editingPlan);
        }
        this.props.hideSavePlanChangesModal();
        this.props.onRequestClose();
    };

    handleModalClose = () => {
        if (this.state.changesMade) {
            this.props.showSavePlanChangesModal();
        } else {
            this.props.onRequestClose();
        }
    };

    confirmSaveChanges = (saveChanges) => {
        if (saveChanges) {
            this.handleUpdatePlan();
        } else {
            this.setState({ changesMade: false });
            this.props.hideSavePlanChangesModal();
            this.props.onRequestClose();
        }
    };

    handleDeletePlan = () => {
        this.props.showDeletePlanModal();
    };

    confirmDeletePlan = () => {
        this.props.deletePlan(this.state.editingPlan.id);
        this.props.hideDeletePlanModal();
        this.props.onRequestClose();
    };

    handleEditRecipe = (recipe) => {
        this.setState({ recipeToEdit: recipe });
        this.props.showEditRecipeModal();
    };

    render() {
        const { isOpen, isSavePlanChangesModalOpen, isDeleteRecipeModalOpen, isDeletePlanModalOpen, isEditRecipeModalOpen } = this.props;
        const { search, filteredRecipes, editingPlan, recipeToEdit } = this.state;

        if (!editingPlan) {
            return null;
        }

        const totalCarbs = editingPlan.recipes.reduce((acc, recipe) => acc + recipe.totalCarbs, 0);
        const totalCalories = editingPlan.recipes.reduce((acc, recipe) => acc + recipe.totalCalories, 0);

        return (
            <Modal
                isOpen={isOpen}
                onRequestClose={this.handleModalClose}
                contentLabel="Edit Plan"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        padding: '20px',
                    },
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Plan for {editingPlan.date}</h2>
                    <div>
                        <span>Total Carbs: {totalCarbs}g</span>
                        <span style={{ marginLeft: '10px' }}>Total Calories: {totalCalories}kcal</span>
                    </div>
                </div>
                <div>
                    <label>Notes:</label>
                    <textarea
                        value={editingPlan.notes}
                        onChange={this.handleNotesChange}
                        rows="4"
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Search for recipes..."
                        value={search}
                        onChange={this.handleSearchChange}
                        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                    />
                    {filteredRecipes.length > 0 && (
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {filteredRecipes.map(recipe => (
                                <li key={recipe.id} onClick={() => this.handleAddRecipe(recipe)} style={{ cursor: 'pointer', padding: '5px 0' }}>
                                    {recipe.name} (Carbs: {recipe.totalCarbs}, Calories: {recipe.totalCalories})
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <table style={{ width: '100%', marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Total Carbs</th>
                            <th>Total Calories</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {editingPlan.recipes.map(recipe => (
                            <tr key={recipe.id}>
                                <td>{recipe.name}</td>
                                <td>{recipe.totalCarbs}</td>
                                <td>{recipe.totalCalories}</td>
                                <td>{recipe.description}</td>
                                <td>
                                    <button onClick={() => this.handleRemoveRecipe(recipe.id)}>Delete</button>
                                    <button onClick={() => this.handleEditRecipe(recipe)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="modal-buttons">
                    <button onClick={this.handleModalClose}>Close</button>
                    <button onClick={this.handleDeletePlan}>Delete Plan</button>
                </div>
                {isDeleteRecipeModalOpen && (
                    <ConfirmDeleteModal
                        isOpen={isDeleteRecipeModalOpen}
                        onRequestClose={this.props.hideDeleteRecipeModal}
                        onConfirm={this.confirmRemoveRecipe}
                        message="Are you sure you want to remove this recipe from the plan?"
                    />
                )}
                {isSavePlanChangesModalOpen && (
                    <ConfirmSaveModal
                        isOpen={isSavePlanChangesModalOpen}
                        onRequestClose={this.props.hideSavePlanChangesModal}
                        onConfirm={this.confirmSaveChanges}
                        message="Save changes before exiting?"
                    />
                )}
                {isDeletePlanModalOpen && (
                    <ConfirmDeleteModal
                        isOpen={isDeletePlanModalOpen}
                        onRequestClose={this.props.hideDeletePlanModal}
                        onConfirm={this.confirmDeletePlan}
                        message="Are you sure you want to delete this plan?"
                    />
                )}
                {isEditRecipeModalOpen && (
                    <EditRecipeModal
                        isOpen={isEditRecipeModalOpen}
                        recipe={recipeToEdit}
                        onRequestClose={this.props.hideEditRecipeModal}
                    />
                )}
            </Modal>
        );
    }
}

const mapStateToProps = (state) => ({
    allRecipes: state.recipes.recipes,
    isOpen: state.editModal.isEditPlanModalOpen,
    isSavePlanChangesModalOpen: state.insertModal.isSavePlanChangesModalOpen,
    isDeleteRecipeModalOpen: state.deleteModal.isDeleteRecipeModalOpen,
    isDeletePlanModalOpen: state.deleteModal.isDeletePlanModalOpen,
    isEditRecipeModalOpen: state.editModal.isEditRecipeModalOpen,
});

const mapDispatchToProps = (dispatch) => ({
    fetchRecipes: () => dispatch(fetchRecipes()),
    addPlan: (plan) => dispatch(addPlan(plan)),
    updatePlan: (plan) => dispatch(updatePlan(plan)),
    deletePlan: (planId) => dispatch(deletePlan(planId)),
    onRequestClose: () => dispatch(hideEditPlanModal()),
    showSavePlanChangesModal: () => dispatch(showSavePlanChangesModal()),
    hideSavePlanChangesModal: () => dispatch(hideSavePlanChangesModal()),
    showDeleteRecipeModal: () => dispatch(showDeleteRecipeModal()),
    hideDeleteRecipeModal: () => dispatch(hideDeleteRecipeModal()),
    showDeletePlanModal: () => dispatch(showDeletePlanModal()),
    hideDeletePlanModal: () => dispatch(hideDeletePlanModal()),
    showEditRecipeModal: () => dispatch(showEditRecipeModal()),
    hideEditRecipeModal: () => dispatch(hideEditRecipeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditPlanModal);
