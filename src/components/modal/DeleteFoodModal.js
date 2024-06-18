import React, { Component } from "react";
import { connect } from "react-redux";
import { DELETE_FOOD_REQUEST, UPDATE_RECIPE_REQUEST } from "../../store/actions/actionTypes";
import Modal from "react-modal";

class DeleteFoodModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            associatedRecipes: []
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.foodId !== prevProps.foodId && this.props.foodId !== null) {
            const associatedRecipes = this.props.recipes.filter(recipe => 
                recipe.foods.some(food => food.id === this.props.foodId));
            this.setState({ associatedRecipes });
        }
    }

    confirmDeleteFood = () => {
        this.state.associatedRecipes.forEach(recipe => {
            const updatedRecipe = {
                ...recipe,
                foods: recipe.foods.filter(food => food.id !== this.props.foodId)
            };
            this.props.updateRecipe(updatedRecipe);
        });
        this.props.deleteFood(this.props.foodId);
        this.props.onRequestClose();
    };

    render() {
        const { isOpen, onRequestClose } = this.props;

        return (
            <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this food?</p>
                <button onClick={this.confirmDeleteFood}>Delete</button>
                <button onClick={onRequestClose}>Cancel</button>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => ({
    recipes: state.recipes.recipes
});

const mapDispatchToProps = (dispatch) => ({
    deleteFood: (id) => dispatch({ type: DELETE_FOOD_REQUEST, payload: id }),
    updateRecipe: (recipe) => dispatch({ type: UPDATE_RECIPE_REQUEST, payload: recipe })
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteFoodModal);
