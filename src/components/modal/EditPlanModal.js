import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { fetchRecipes } from '../../store/actions/recipeActions';
import { addPlan, updatePlan, fetchDayPlan } from '../../store/actions/planActions';

class EditPlanModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            filteredRecipes: [],
            notes: props.plan ? props.plan.notes : '',
            recipes: props.plan ? props.plan.recipes : []
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
                recipes: this.props.plan ? this.props.plan.recipes : []
            });
        }
    }

    handleSearchChange = (e) => {
        const search = e.target.value;
        const searchLower = search.toLowerCase();
        const filtered = this.props.allRecipes.filter(recipe => recipe.name.toLowerCase().includes(searchLower));
        this.setState({ search, filteredRecipes: filtered });
    };

    handleAddRecipe = (recipe) => {
        const updatedRecipes = [...this.state.recipes, recipe];
        const updatedPlan = { ...this.props.plan, recipes: updatedRecipes };
        this.props.updatePlan(updatedPlan);
        this.setState({ search: '', filteredRecipes: [] });
        this.props.fetchDayPlan(...this.props.plan.date.split('-'));
    };

    handleRemoveRecipe = (recipeId) => {
        const updatedRecipes = this.state.recipes.filter(recipe => recipe.id !== recipeId);
        const updatedPlan = { ...this.props.plan, recipes: updatedRecipes };
        this.props.updatePlan(updatedPlan);
        this.props.fetchDayPlan(...this.props.plan.date.split('-'));
    };

    handleNotesChange = (e) => {
        this.setState({ notes: e.target.value });
    };

    handleSaveNotes = () => {
        const updatedPlan = { ...this.props.plan, notes: this.state.notes };
        this.props.updatePlan(updatedPlan);
    };

    render() {
        const { isOpen, onRequestClose, plan } = this.props;
        const { search, filteredRecipes, notes, recipes } = this.state;

        if (!plan) {
            return null;
        }

        const totalCarbs = recipes.reduce((acc, recipe) => acc + recipe.totalCarbs, 0);
        const totalCalories = recipes.reduce((acc, recipe) => acc + recipe.totalCalories, 0);

        return (
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
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
                <h2>Plan for {plan.date}</h2>
                <div>
                    <div>Total Carbs: {totalCarbs}g</div>
                    <div>Total Calories: {totalCalories}kcal</div>
                </div>
                <div>
                    <label>Notes:</label>
                    <textarea
                        value={notes}
                        onChange={this.handleNotesChange}
                        onBlur={this.handleSaveNotes}
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="modal-buttons">
                    <button onClick={onRequestClose}>Close</button>
                </div>
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
