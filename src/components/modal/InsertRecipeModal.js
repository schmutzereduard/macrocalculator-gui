import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchFoods } from '../../store/actions/foodActions';
import { addRecipe } from '../../store/actions/recipeActions';
import Modal from 'react-modal';

class InsertRecipeModal extends Component {
    
    state = {
        name: '',
        selectedFoods: [],
        foodQuantities: {}
    };

    componentDidMount() {
        this.props.fetchFoods();
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleFoodSelect = (food) => {
        if (!this.state.selectedFoods.includes(food)) {
            this.setState({ 
                selectedFoods: [...this.state.selectedFoods, food],
                foodQuantities: { ...this.state.foodQuantities, [food.id]: '' }
            });
        }
    };

    handleFoodRemove = (food) => {
        const { foodQuantities } = this.state;
        delete foodQuantities[food.id];
        this.setState({ 
            selectedFoods: this.state.selectedFoods.filter(f => f !== food),
            foodQuantities
        });
    };

    handleQuantityChange = (foodId, quantity) => {
        this.setState({
            foodQuantities: { ...this.state.foodQuantities, [foodId]: quantity }
        });
    };

    handleAddRecipe = () => {
        const { name, selectedFoods, foodQuantities } = this.state;
        const recipeFoods = selectedFoods.map(food => ({
            food,
            quantity: foodQuantities[food.id]
        }));
        this.props.addRecipe({ name, recipeFoods });
        this.props.onRequestClose();
        this.setState({ name: '', selectedFoods: [], foodQuantities: {} });
    };

    render() {
        const { isOpen, onRequestClose, foods } = this.props;
        const { name, selectedFoods, foodQuantities } = this.state;

        const isSaveDisabled = !name || selectedFoods.some(food => !foodQuantities[food.id]);

        return (
            <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
                <h2>Add Recipe</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Recipe Name"
                    value={name}
                    onChange={this.handleInputChange}
                />
                <div>
                    <h3>Available Foods</h3>
                    <ul>
                        {foods.map(food => (
                            <li key={food.id}>
                                {food.name} <button onClick={() => this.handleFoodSelect(food)}>Add</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3>Selected Foods</h3>
                    <ul>
                        {selectedFoods.map(food => (
                            <li key={food.id}>
                                {food.name} 
                                <input
                                    type="number"
                                    placeholder="Quantity (g)"
                                    value={foodQuantities[food.id]}
                                    onChange={(e) => this.handleQuantityChange(food.id, e.target.value)}
                                />
                                <button onClick={() => this.handleFoodRemove(food)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <button onClick={this.handleAddRecipe} disabled={isSaveDisabled}>Save</button>
                <button onClick={onRequestClose}>Cancel</button>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => ({
    foods: state.foods.foods
});

const mapDispatchToProps = (dispatch) => ({
    fetchFoods: () => dispatch(fetchFoods()),
    addRecipe: (recipe) => dispatch(addRecipe(recipe))
});

export default connect(mapStateToProps, mapDispatchToProps)(InsertRecipeModal);
