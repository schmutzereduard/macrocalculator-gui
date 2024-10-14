import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { fetchRecipes } from '../../store/actions/recipeActions';
import { addJournal, updateJournal, deleteJournal } from '../../store/actions/journalActions';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import ConfirmSaveModal from './ConfirmSaveModal';
import EditRecipeModal from './EditRecipeModal';
import EditFoodModal from './EditFoodModal';
import {
    showSaveJournalChangesModal,
    hideSaveJournalChangesModal
} from '../../store/actions/modal/insert';
import {
    showDeleteRecipeModal,
    hideDeleteRecipeModal,
    showDeleteJournalModal,
    hideDeleteJournalModal
} from '../../store/actions/modal/delete';
import {
    hideEditJournalModal,
    showEditRecipeModal,
    hideEditRecipeModal,
    showEditFoodModal,
    hideEditFoodModal
} from '../../store/actions/modal/edit';

class EditJournalModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editingJournal: props.journal || { date: '', notes: '', entries: [] },
            changesMade: false,
            newEntry: {
                time: '',
                bloodSugarLevel: '',
                recipes: [],
                foods: [],
                insulinUnits: '',
                insulinType: ''
            },
            currentPage: 1,
            itemsPerPage: 5,
            addingEntry: false,
            recipeToEdit: null,
            foodToEdit: null,
        };
    }

    componentDidMount() {
        if (this.props.isOpen) {
            this.props.fetchRecipes();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.journal !== this.props.journal) {
            this.setState({
                editingJournal: this.props.journal || { date: '', notes: '', entries: [] },
                changesMade: false,
            });
        }

        if (prevProps.allRecipes !== this.props.allRecipes) {
            this.updateRecipeInfo();
        }
    }

    updateRecipeInfo = () => {
        const { editingJournal } = this.state;
        if (editingJournal.entries) {
            const updatedEntries = editingJournal.entries.map(entry => {
                const updatedRecipes = entry.journalRecipes.map(journalRecipe => {
                    const updatedRecipe = this.props.allRecipes.find(r => r.id === journalRecipe.recipe.id);
                    return updatedRecipe ? { ...journalRecipe, recipe: { ...journalRecipe.recipe, ...updatedRecipe } } : journalRecipe;
                });
                return { ...entry, journalRecipes: updatedRecipes };
            });

            this.setState({
                editingJournal: { ...editingJournal, entries: updatedEntries },
            });
        }
    };

    handleSearchChange = (e) => {
        const search = e.target.value.toLowerCase();
        const filtered = this.props.allRecipes.filter(
            recipe => recipe.name.toLowerCase().includes(search)
        );
        this.setState({ search, filteredRecipes: filtered });
    };

    handleAddRecipe = (recipe) => {
        const updatedRecipes = [...this.state.editingJournal.entries.recipes, recipe];
        this.setState({
            editingJournal: { ...this.state.editingJournal, entries: updatedRecipes },
            search: '',
            filteredRecipes: [],
            changesMade: true,
        });
    };

    handleRemoveRecipe = (entryIndex, recipeId) => {
        const { editingJournal } = this.state;
        const updatedEntries = [...editingJournal.entries];
        updatedEntries[entryIndex].journalRecipes = updatedEntries[entryIndex].journalRecipes.filter(journalRecipe => journalRecipe.id !== recipeId);
        this.setState({ editingJournal: { ...editingJournal, entries: updatedEntries }, changesMade: true });
    };

    handleNotesChange = (e) => {
        this.setState({ editingJournal: { ...this.state.editingJournal, notes: e.target.value }, changesMade: true });
    };

    handleUpdateJournal = () => {
        const { editingJournal } = this.state;
        if (this.props.journal.id) {
            this.props.updateJournal(editingJournal);
        } else {
            this.props.addJournal(editingJournal);
        }
        this.props.hideSaveJournalChangesModal();
        this.props.onRequestClose();
    };

    handleModalClose = () => {
        if (this.state.changesMade) {
            this.props.showSaveJournalChangesModal();
        } else {
            this.props.onRequestClose();
        }
    };

    confirmSaveChanges = (saveChanges) => {
        if (saveChanges) {
            this.handleUpdateJournal();
        } else {
            this.setState({ changesMade: false });
            this.props.hideSaveJournalChangesModal();
            this.props.onRequestClose();
        }
    };

    handleDeleteJournal = () => {
        this.props.showDeleteJournalModal();
    };

    confirmDeleteJournal = () => {
        this.props.deleteJournal(this.state.editingJournal.id);
        this.props.hideDeleteJournalModal();
        this.props.onRequestClose();
    };

    handleEditRecipe = (recipe) => {
        this.setState({ recipeToEdit: recipe });
        this.props.showEditRecipeModal();
    };

    handleEditFood = (food) => {
        this.setState({ foodToEdit: food });
        this.props.showEditFoodModal();
    };

    handleAddEntry = () => {
        this.setState({ addingEntry: true });
    };

    handleNewEntryChange = (field) => (e) => {
        const { newEntry } = this.state;
        newEntry[field] = e.target.value;
        this.setState({ newEntry });
    };

    handleSaveNewEntry = (e) => {
        e.preventDefault();
        const { editingJournal, newEntry } = this.state;
        editingJournal.entries.push(newEntry);
        this.setState({
            editingJournal,
            addingEntry: false,
            newEntry: { time: '', bloodSugarLevel: '', recipes: [], foods: [], insulinUnits: '', insulinType: '' },
            changesMade: true
        });
    };

    handleDeleteEntry = (index) => {
        const { editingJournal } = this.state;
        editingJournal.entries.splice(index, 1);
        this.setState({ editingJournal, changesMade: true });
    };

    calculateEntryNutrition = (entry) => {
        let totalCarbs = 0;
        let totalCalories = 0;
        if (entry.journalRecipes) {
            entry.journalRecipes.forEach(journalRecipe => {
                totalCarbs += journalRecipe.carbs || 0;
                totalCalories += journalRecipe.calories || 0;
            });
        }
        if (entry.journalFoods) {
            entry.journalFoods.forEach(journalFood => {
                totalCarbs += journalFood.carbs || 0;
                totalCalories += journalFood.calories || 0;
            });
        }
        return `Carbs: ${totalCarbs}g, Calories: ${totalCalories}kcal`;
    };

    render() {
        const { isOpen, isSaveJournalChangesModalOpen, isDeleteRecipeModalOpen, isDeleteJournalModalOpen, isEditRecipeModalOpen, isEditFoodModalOpen } = this.props;
        const { editingJournal, currentPage, itemsPerPage, newEntry, addingEntry, recipeToEdit, foodToEdit } = this.state;

        if (!editingJournal) {
            return null;
        }

        const totalEntries = editingJournal.entries ? editingJournal.entries.length : 0;
        const totalPages = Math.ceil(totalEntries / itemsPerPage);
        const displayedEntries = editingJournal.entries ? editingJournal.entries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];

        return (
            <Modal
                isOpen={isOpen}
                onRequestClose={this.handleModalClose}
                contentLabel="Edit Journal"
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
                        overflow: 'hidden', // Prevent side scrolling
                        maxWidth: '100%' // Prevent side scrolling
                    },
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Journal for {editingJournal.date}</h2>
                </div>
                <div>
                    <label>Notes:</label>
                    <textarea
                        value={editingJournal.notes || ''}
                        onChange={this.handleNotesChange}
                        rows="4"
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                </div>
                <div>
                    <h3>Entries</h3>
                    <table style={{ width: '100%', marginTop: '20px' }}>
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Blood Sugar Level</th>
                                <th>Recipes</th>
                                <th>Foods</th>
                                <th>Total Carbs & Calories</th>
                                <th>Insulin Units</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedEntries.map((entry, index) => (
                                <tr key={index}>
                                    <td>{new Date(entry.time).toLocaleTimeString()}</td>
                                    <td>{entry.bloodSugarBefore}</td>
                                    <td>
                                        {entry.journalRecipes && entry.journalRecipes.map(journalRecipe => (
                                            <div key={journalRecipe.id} onClick={() => this.handleEditRecipe(journalRecipe.recipe)}>{journalRecipe.recipe.name}</div>
                                        ))}
                                    </td>
                                    <td>
                                        {entry.journalFoods && entry.journalFoods.map(journalFood => (
                                            <div key={journalFood.id} onClick={() => this.handleEditFood(journalFood.food)}>{journalFood.food.name}</div>
                                        ))}
                                    </td>
                                    <td>{this.calculateEntryNutrition(entry)}</td>
                                    <td>{entry.insulinCorrection} ({entry.insulinType})</td>
                                    <td><button onClick={() => this.handleDeleteEntry(index)}>Delete</button></td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan="7">
                                    <button onClick={this.handleAddEntry}>+</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => this.setState({ currentPage: page })}
                                className={page === currentPage ? 'active' : ''}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </div>

                {addingEntry && (
                    <div>
                        <h3>Add New Entry</h3>
                        <form onSubmit={this.handleSaveNewEntry}>
                            <input type="time" value={newEntry.time} onChange={this.handleNewEntryChange('time')} required />
                            <input type="number" value={newEntry.bloodSugarLevel} onChange={this.handleNewEntryChange('bloodSugarLevel')} placeholder="Blood Sugar Level" required />
                            {/* Similar inputs for recipes, foods, insulin units, and insulin type */}
                            <button type="submit">Save</button>
                        </form>
                    </div>
                )}

                {isDeleteRecipeModalOpen && (
                    <ConfirmDeleteModal
                        isOpen={isDeleteRecipeModalOpen}
                        onRequestClose={this.props.hideDeleteRecipeModal}
                        onConfirm={this.confirmRemoveRecipe}
                        message="Are you sure you want to remove this recipe from the journal?"
                    />
                )}
                {isSaveJournalChangesModalOpen && (
                    <ConfirmSaveModal
                        isOpen={isSaveJournalChangesModalOpen}
                        onRequestClose={this.props.hideSaveJournalChangesModal}
                        onConfirm={this.confirmSaveChanges}
                        message="Save changes before exiting?"
                    />
                )}
                {isDeleteJournalModalOpen && (
                    <ConfirmDeleteModal
                        isOpen={isDeleteJournalModalOpen}
                        onRequestClose={this.props.hideDeleteJournalModal}
                        onConfirm={this.confirmDeleteJournal}
                        message="Are you sure you want to delete this journal?"
                    />
                )}
                {isEditRecipeModalOpen && (
                    <EditRecipeModal
                        isOpen={isEditRecipeModalOpen}
                        recipe={recipeToEdit}
                        onRequestClose={this.props.hideEditRecipeModal}
                    />
                )}
                {isEditFoodModalOpen && (
                    <EditFoodModal
                        isOpen={isEditFoodModalOpen}
                        food={foodToEdit}
                        onRequestClose={this.props.hideEditFoodModal}
                    />
                )}
            </Modal>
        );
    }
}

const mapStateToProps = (state) => ({
    allRecipes: state.recipes.recipes,
    isOpen: state.editModal.isEditJournalModalOpen,
    isSaveJournalChangesModalOpen: state.insertModal.isSaveJournalChangesModalOpen,
    isDeleteRecipeModalOpen: state.deleteModal.isDeleteRecipeModalOpen,
    isDeleteJournalModalOpen: state.deleteModal.isDeleteJournalModalOpen,
    isEditRecipeModalOpen: state.editModal.isEditRecipeModalOpen,
    isEditFoodModalOpen: state.editModal.isEditFoodModalOpen,
});

const mapDispatchToProps = (dispatch) => ({
    fetchRecipes: () => dispatch(fetchRecipes()),
    addJournal: (journal) => dispatch(addJournal(journal)),
    updateJournal: (journal) => dispatch(updateJournal(journal)),
    deleteJournal: (journalId) => dispatch(deleteJournal(journalId)),
    onRequestClose: () => dispatch(hideEditJournalModal()),
    showSaveJournalChangesModal: () => dispatch(showSaveJournalChangesModal()),
    hideSaveJournalChangesModal: () => dispatch(hideSaveJournalChangesModal()),
    showDeleteRecipeModal: () => dispatch(showDeleteRecipeModal()),
    hideDeleteRecipeModal: () => dispatch(hideDeleteRecipeModal()),
    showDeleteJournalModal: () => dispatch(showDeleteJournalModal()),
    hideDeleteJournalModal: () => dispatch(hideDeleteJournalModal()),
    showEditRecipeModal: () => dispatch(showEditRecipeModal()),
    hideEditRecipeModal: () => dispatch(hideEditRecipeModal()),
    showEditFoodModal: () => dispatch(showEditFoodModal()),
    hideEditFoodModal: () => dispatch(hideEditFoodModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditJournalModal);
