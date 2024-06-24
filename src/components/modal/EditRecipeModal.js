import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { fetchFoods } from '../../store/actions/foodActions';
import { updateRecipe } from '../../store/actions/recipeActions';
import { showSaveRecipeChangesModal, hideSaveRecipeChangesModal } from '../../store/actions/modal/insert';
import ConfirmSaveModal from '../modal/ConfirmSaveModal';

class EditRecipeModal extends Component {
    state = {
        selectedFoods: [],
        foodQuantities: {},
        foodToRemove: null,
        showRemoveConfirmModal: false,
        recipeFoodsVisual: [],
        description: '',
        name: '',
        search: '',
        itemsPerPage: 10,
        currentPage: 1,
        changesMade: false,
        initialRecipe: null // To store the initial state of the recipe
    };

    componentDidMount() {
        const { recipe } = this.props;
        this.props.fetchFoods();
        if (recipe) {
            this.setState({
                recipeFoodsVisual: recipe.recipeFoods || [],
                description: recipe.description || '',
                name: recipe.name || '',
                initialRecipe: recipe, // Store the initial state of the recipe
                changesMade: false // Reset changesMade when the component mounts
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.recipe?.id !== prevProps.recipe?.id) {
            this.setState({
                foodQuantities: {},
                recipeFoodsVisual: this.props.recipe?.recipeFoods || [],
                description: this.props.recipe?.description || '',
                name: this.props.recipe?.name || '',
                initialRecipe: this.props.recipe, // Store the initial state of the recipe
                changesMade: false // Reset changesMade when a new recipe is loaded
            });
        }
    }

    handleRemoveFood = (foodId) => {
        this.setState({
            foodToRemove: foodId,
            showRemoveConfirmModal: true,
            changesMade: true
        });
    };

    confirmRemoveFood = () => {
        const { foodToRemove, recipeFoodsVisual } = this.state;
        const updatedRecipeFoods = recipeFoodsVisual.filter(rf => rf.food.id !== foodToRemove);
        this.setState({
            recipeFoodsVisual: updatedRecipeFoods,
            showRemoveConfirmModal: false,
            foodToRemove: null
        });
    };

    handleQuantityChange = (foodId, quantity) => {
        this.setState({
            foodQuantities: { ...this.state.foodQuantities, [foodId]: quantity },
            changesMade: true
        });
    };

    handleAddFoodsToRecipe = () => {
        const { foodQuantities, recipeFoodsVisual } = this.state;
        const newRecipeFoods = Object.keys(foodQuantities).map(foodId => {
            const food = this.props.foods.find(f => f.id === parseInt(foodId));
            return {
                food,
                quantity: foodQuantities[foodId]
            };
        }).filter(item => item.quantity > 0);
        
        const updatedRecipeFoods = [...recipeFoodsVisual, ...newRecipeFoods];
        this.setState({
            selectedFoods: [],
            foodQuantities: {},
            recipeFoodsVisual: updatedRecipeFoods,
            changesMade: true
        });
    };

    handleDescriptionChange = (e) => {
        this.setState({ description: e.target.value, changesMade: true });
    };

    handleNameChange = (e) => {
        this.setState({ name: e.target.value, changesMade: true });
    };

    handleSearchChange = (e) => {
        this.setState({ search: e.target.value });
    };

    handleItemsPerPageChange = (e) => {
        this.setState({ itemsPerPage: parseInt(e.target.value, 10), currentPage: 1 });
    };

    handlePageChange = (page) => {
        this.setState({ currentPage: page });
    };

    handleUpdateRecipe = () => {
        if (!this.props.recipe) return;
        const updatedRecipe = {
            ...this.props.recipe,
            description: this.state.description,
            name: this.state.name,
            recipeFoods: this.state.recipeFoodsVisual
        };
        this.props.updateRecipe(updatedRecipe);
        this.setState({ initialRecipe: updatedRecipe, changesMade: false }); // Update the initial state and reset changesMade
    };

    handleModalClose = () => {
        const { initialRecipe, recipeFoodsVisual, description, name } = this.state;
        const isChanged = JSON.stringify(initialRecipe.recipeFoods) !== JSON.stringify(recipeFoodsVisual) ||
                          initialRecipe.description !== description ||
                          initialRecipe.name !== name;

        if (isChanged) {
            this.props.showSaveChangesModal();
        } else {
            this.props.onRequestClose();
        }
    };

    confirmSaveChanges = (saveChanges) => {
        if (saveChanges) {
            this.handleUpdateRecipe();
        }
        this.props.hideSaveChangesModal();
        this.props.onRequestClose();
    };

    calculateNutritionalInfo = (food, quantity) => {
        const carbs = (food.carbs / 100) * quantity;
        const kcal = (food.calories / 100) * quantity;
        return `c: ${carbs.toFixed(1)} kCal: ${kcal.toFixed(1)}`;
    };

    calculateTotalRecipeNutritionalInfo = () => {
        const { recipeFoodsVisual } = this.state;
        let totalCarbs = 0;
        let totalCalories = 0;

        recipeFoodsVisual.forEach(rf => {
            totalCarbs += (rf.food.carbs / 100) * rf.quantity;
            totalCalories += (rf.food.calories / 100) * rf.quantity;
        });

        return `carbs: ${totalCarbs.toFixed(1)} | calories: ${totalCalories.toFixed(1)}`;
    };

    calculateTotalNutritionalInfo = () => {
        const { foodQuantities } = this.state;
        let totalCarbs = 0;
        let totalCalories = 0;

        Object.keys(foodQuantities).forEach(foodId => {
            const food = this.props.foods.find(f => f.id === parseInt(foodId));
            const quantity = foodQuantities[foodId];
            if (food && quantity > 0) {
                totalCarbs += (food.carbs / 100) * quantity;
                totalCalories += (food.calories / 100) * quantity;
            }
        });

        return `carbs: ${totalCarbs.toFixed(1)} | calories: ${totalCalories.toFixed(1)}`;
    };

    getFilteredFoods = () => {
        const { foods } = this.props;
        const { search } = this.state;
        return foods.filter(food => {
            const searchLower = search.toLowerCase();
            return food.name.toLowerCase().includes(searchLower) || food.type.toLowerCase().includes(searchLower);
        });
    };

    getPaginatedFoods = () => {
        const { itemsPerPage, currentPage } = this.state;
        const filteredFoods = this.getFilteredFoods();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredFoods.slice(startIndex, endIndex);
    };

    renderPagination = () => {
        const { itemsPerPage, currentPage } = this.state;
        const filteredFoods = this.getFilteredFoods();
        const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);

        return (
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        onClick={() => this.handlePageChange(page)}
                        className={page === currentPage ? 'active' : ''}
                    >
                        {page}
                    </button>
                ))}
            </div>
        );
    };

    adjustTextareaHeight = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    render() {
        const { isOpen, isSaveChangesRecipeModalOpen } = this.props;
        const { foodQuantities, showRemoveConfirmModal, recipeFoodsVisual, description, name, search, itemsPerPage } = this.state;
        const availableFoods = this.getPaginatedFoods();

        return (
            <Modal isOpen={isOpen} onRequestClose={this.handleModalClose}>
                <div>
                    <input
                        type="text"
                        name="name"
                        placeholder="Recipe Name"
                        value={name}
                        onChange={this.handleNameChange}
                        style={{ width: '100%', height: '50px', fontSize: '16px', marginBottom: '10px' }}
                    />
                </div>
                <div>
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => { this.handleDescriptionChange(e); this.adjustTextareaHeight(e); }}
                        style={{ width: '100%', height: '100px', fontSize: '16px', marginBottom: '10px', overflow: 'hidden' }}
                        rows="3"
                    />
                </div>
                <div>
                    <h3>Foods in this Recipe ({this.calculateTotalRecipeNutritionalInfo()})</h3>
                    <ul className="list">
                        {recipeFoodsVisual.map((rf, index) => (
                            <li key={index} className="list-item">
                                {rf.food.name} - {rf.quantity}g
                                <button onClick={() => this.handleRemoveFood(rf.food.id)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <button onClick={this.handleAddFoodsToRecipe}>Add Foods</button>
                        <input
                            type="text"
                            placeholder="Search for foods..."
                            value={search}
                            onChange={this.handleSearchChange}
                            style={{ marginLeft: '10px' }}
                        />
                        <div>{this.calculateTotalNutritionalInfo()}</div>
                        <select onChange={this.handleItemsPerPageChange} value={itemsPerPage} style={{ marginLeft: '10px' }}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                    </div>
                    <ul className="list">
                        {availableFoods.map(food => (
                            <li key={food.id} className="available-food-item">
                                <div>{food.name} ({this.calculateNutritionalInfo(food, foodQuantities[food.id] || 0)})</div>
                                <input
                                    type="number"
                                    placeholder="Quantity (g)"
                                    value={foodQuantities[food.id] || ''}
                                    onChange={(e) => this.handleQuantityChange(food.id, e.target.value)}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button onClick={this.handleModalClose}>Close</button>
                    {this.renderPagination()}
                </div>

                {showRemoveConfirmModal && (
                    <Modal isOpen={showRemoveConfirmModal}>
                        <h2>Confirm Removal</h2>
                        <p>Are you sure you want to remove this food from the recipe?</p>
                        <button onClick={this.confirmRemoveFood}>Yes</button>
                        <button onClick={() => this.setState({ showRemoveConfirmModal: false })}>No</button>
                    </Modal>
                )}
                {isSaveChangesRecipeModalOpen && (
                    <ConfirmSaveModal
                        isOpen={isSaveChangesRecipeModalOpen}
                        onRequestClose={this.props.hideSaveChangesModal}
                        onConfirm={this.confirmSaveChanges}
                        message="Save changes before exiting?"
                    />
                )}
            </Modal>
        );
    }
}

const mapStateToProps = (state) => ({
    foods: state.foods.foods,
    isSaveChangesRecipeModalOpen: state.insertModal.isSaveRecipeChangesModalOpen
});

const mapDispatchToProps = (dispatch) => ({
    fetchFoods: () => dispatch(fetchFoods()),
    updateRecipe: (recipe) => dispatch(updateRecipe(recipe)),
    showSaveChangesModal: () => dispatch(showSaveRecipeChangesModal()),
    hideSaveChangesModal: () => dispatch(hideSaveRecipeChangesModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(EditRecipeModal);
