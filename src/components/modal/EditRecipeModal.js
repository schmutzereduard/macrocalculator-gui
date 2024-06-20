import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { fetchFoods } from '../../store/actions/foodActions';
import { updateRecipe, fetchRecipe } from '../../store/actions/recipeActions';

class ViewRecipeModal extends Component {
    state = {
        selectedFoods: [],
        foodQuantities: {},
        foodToRemove: null,
        showRemoveConfirmModal: false,
        recipeFoodsVisual: []
    };

    componentDidMount() {
        this.props.fetchFoods();
        this.setState({ recipeFoodsVisual: this.props.recipe.recipeFoods || [] });
    }

    componentDidUpdate(prevProps) {
        if (this.props.recipe.id !== prevProps.recipe.id) {
            this.setState({
                foodQuantities: {},
                recipeFoodsVisual: this.props.recipe.recipeFoods || []
            });
        }
    }

    handleRemoveFood = (foodId) => {
        this.setState({
            foodToRemove: foodId,
            showRemoveConfirmModal: true
        });
    };

    confirmRemoveFood = () => {
        const { foodToRemove, recipeFoodsVisual } = this.state;
        const updatedRecipeFoods = recipeFoodsVisual.filter(rf => rf.food.id !== foodToRemove);
        const updatedRecipe = {
            ...this.props.recipe,
            recipeFoods: updatedRecipeFoods
        };
        this.props.updateRecipe(updatedRecipe);
        this.setState({
            showRemoveConfirmModal: false,
            foodToRemove: null,
            recipeFoodsVisual: updatedRecipeFoods
        });
        this.props.fetchRecipe(this.props.recipe.id);
    };

    handleFoodSelect = (food) => {
        const foodExistsInRecipe = this.state.recipeFoodsVisual.some(rf => rf.food.id === food.id);
        if (!foodExistsInRecipe && !this.state.selectedFoods.includes(food)) {
            this.setState({ 
                selectedFoods: [...this.state.selectedFoods, food],
                foodQuantities: { ...this.state.foodQuantities, [food.id]: '' }
            });
        }
    };

    handleQuantityChange = (foodId, quantity) => {
        this.setState({
            foodQuantities: { ...this.state.foodQuantities, [foodId]: quantity }
        });
    };

    handleAddFoodToRecipe = (food) => {
        const { foodQuantities, recipeFoodsVisual } = this.state;
        const quantity = foodQuantities[food.id];
        if (quantity > 0) {
            const newRecipeFood = {
                food,
                quantity
            };
            const updatedRecipeFoods = [...recipeFoodsVisual, newRecipeFood];
            const updatedRecipe = {
                ...this.props.recipe,
                recipeFoods: updatedRecipeFoods
            };
            this.props.updateRecipe(updatedRecipe);
            this.setState({
                selectedFoods: this.state.selectedFoods.filter(f => f.id !== food.id),
                foodQuantities: { ...this.state.foodQuantities, [food.id]: '' },
                recipeFoodsVisual: updatedRecipeFoods
            });
            this.props.fetchRecipe(this.props.recipe.id);
        }
    };

    render() {
        const { isOpen, onRequestClose, recipe, foods } = this.props;
        const { foodQuantities, showRemoveConfirmModal, recipeFoodsVisual } = this.state;
        const availableFoods = foods.filter(food => 
            !recipeFoodsVisual.some(rf => rf.food.id === food.id)
        );

        return (
            <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
                <h2>{recipe.name}</h2>
                <div>
                    <h3>Foods in this Recipe</h3>
                    <ul>
                        {recipeFoodsVisual.map((rf, index) => (
                            <li key={index}>
                                {rf.food.name} - {rf.quantity}g
                                <button onClick={() => this.handleRemoveFood(rf.food.id)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3>Add Foods to Recipe</h3>
                    <ul>
                        {availableFoods.map(food => (
                            <li key={food.id}>
                                {food.name}
                                <input
                                    type="number"
                                    placeholder="Quantity (g)"
                                    value={foodQuantities[food.id] || ''}
                                    onChange={(e) => this.handleQuantityChange(food.id, e.target.value)}
                                />
                                <button onClick={() => this.handleAddFoodToRecipe(food)}>Add</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <button onClick={onRequestClose}>Close</button>

                {showRemoveConfirmModal && (
                    <Modal isOpen={showRemoveConfirmModal}>
                        <h2>Confirm Removal</h2>
                        <p>Are you sure you want to remove this food from the recipe?</p>
                        <button onClick={this.confirmRemoveFood}>Yes</button>
                        <button onClick={() => this.setState({ showRemoveConfirmModal: false })}>No</button>
                    </Modal>
                )}
            </Modal>
        );
    }
}

const mapStateToProps = (state) => ({
    foods: state.foods.foods
});

const mapDispatchToProps = (dispatch) => ({
    fetchFoods: () => dispatch(fetchFoods()),
    updateRecipe: (recipe) => dispatch(updateRecipe(recipe)),
    fetchRecipe: (id) => dispatch(fetchRecipe(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewRecipeModal);
