import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { fetchRecipes } from '../../store/actions/recipeActions';
import { addPlan, updatePlan, fetchDayPlan } from '../../store/actions/planActions';
import ConfirmSaveModal from '../modal/ConfirmSaveModal';
import ConfirmationModal from '../modal/ConfirmationModal';

class EditPlanModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            filteredRecipes: [],
            notes: props.plan ? props.plan.notes : '',
            recipes: props.plan ? props.plan.recipes : [],
            showRemoveConfirmModal: false,
            recipeToRemove: null,
            showSaveConfirmModal: false,
            changesMade: false
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
                notes: this.props.plan ? this.props.plan.notes : '',
                recipes: this.props.plan ? this.props.plan.recipes : [],
                changesMade: false
            });
        }
    }

    handleSearchChange = (e) => {
        const search = e.target.value;
        const searchLower = search.toLowerCase();
        const filtered = this.props.allRecipes.filter(
            recipe => recipe.name.toLowerCase().includes(searchLower) && !this.state.recipes.some(r => r.id === recipe.id)
        );
        this.setState({ search, filteredRecipes: filtered });
    };

    handleAddRecipe = (recipe) => {
        const updatedRecipes = [...this.state.recipes, recipe];
        this.setState({
            recipes: updatedRecipes,
            search: '',
            filteredRecipes: [],
            changesMade: true
        });
    };

    handleRemoveRecipe = (recipeId) => {
        this.setState({
            showRemoveConfirmModal: true,
            recipeToRemove: recipeId
        });
    };

    confirmRemoveRecipe = () => {
        const updatedRecipes = this.state.recipes.filter(recipe => recipe.id !== this.state.recipeToRemove);
        this.setState({
            recipes: updatedRecipes,
            showRemoveConfirmModal: false,
            recipeToRemove: null,
            changesMade: true
        });
    };

    handleNotesChange = (e) => {
        this.setState({ notes: e.target.value, changesMade: true });
    };

    handleSaveNotes = () => {
        const updatedPlan = { ...this.props.plan, notes: this.state.notes, recipes: this.state.recipes };
        this.props.updatePlan(updatedPlan);
    };

    handleModalClose = () => {
        if (this.state.changesMade) {
            this.setState({ showSaveConfirmModal: true });
        } else {
            this.props.onRequestClose();
        }
    };

    confirmSaveChanges = (saveChanges) => {
        if (saveChanges) {
            this.handleSaveNotes();
        } else {
            this.props.onRequestClose();
        }
        this.setState({ showSaveConfirmModal: false });
    };

    render() {
        const { isOpen, onRequestClose, plan } = this.props;
        const { search, filteredRecipes, notes, recipes, showRemoveConfirmModal, showSaveConfirmModal } = this.state;

        if (!plan) {
            return null;
        }

        const totalCarbs = recipes.reduce((acc, recipe) => acc + recipe.totalCarbs, 0);
        const totalCalories = recipes.reduce((acc, recipe) => acc + recipe.totalCalories, 0);

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
                        padding: '20px'
                    }
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Plan for {plan.date}</h2>
                    <div>
                        <span>Total Carbs: {totalCarbs}g</span>
                        <span style={{ marginLeft: '10px' }}>Total Calories: {totalCalories}kcal</span>
                    </div>
                </div>
                <div>
                    <label>Notes:</label>
                    <textarea
                        value={notes}
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
                        {recipes.map(recipe => (
                            <tr key={recipe.id}>
                                <td>{recipe.name}</td>
                                <td>{recipe.totalCarbs}</td>
                                <td>{recipe.totalCalories}</td>
                                <td>{recipe.description}</td>
                                <td>
                                    <button onClick={() => this.handleRemoveRecipe(recipe.id)}>Delete</button>
                                    <button>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="modal-buttons">
                    <button onClick={this.handleModalClose}>Close</button>
                </div>
                {showRemoveConfirmModal && (
                    <ConfirmationModal
                        isOpen={showRemoveConfirmModal}
                        onRequestClose={() => this.setState({ showRemoveConfirmModal: false, recipeToRemove: null })}
                        onConfirm={this.confirmRemoveRecipe}
                        message="Are you sure you want to remove this recipe from the plan?"
                    />
                )}
                {showSaveConfirmModal && (
                    <ConfirmSaveModal
                        isOpen={showSaveConfirmModal}
                        onRequestClose={() => this.setState({ showSaveConfirmModal: false })}
                        onConfirm={this.confirmSaveChanges}
                        message="Save changes before exiting?"
                    />
                )}
            </Modal>
        );
    }
}

const mapStateToProps = (state) => ({
    allRecipes: state.recipes.recipes
});

const mapDispatchToProps = (dispatch) => ({
    fetchRecipes: () => dispatch(fetchRecipes()),
    updatePlan: (plan) => dispatch(updatePlan(plan)),
    fetchDayPlan: (year, month, day) => dispatch(fetchDayPlan(year, month, day))
});

export default connect(mapStateToProps, mapDispatchToProps)(EditPlanModal);
