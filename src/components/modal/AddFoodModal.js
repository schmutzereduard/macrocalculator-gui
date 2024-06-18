import React, { Component } from "react";
import { connect } from "react-redux";
import { ADD_FOOD_REQUEST, FETCH_FOOD_TYPES_REQUEST } from "../../store/actions/actionTypes";
import Modal from "react-modal";

class AddFoodModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newFood: { name: '', carbs: '', calories: '', type: '' }
        };
    }

    componentDidMount() {
        this.props.fetchFoodTypes();
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            newFood: { ...this.state.newFood, [name]: value }
        });
    };

    handleAddFood = () => {
        this.props.addFood(this.state.newFood);
        this.props.onRequestClose();
        this.setState({ newFood: { name: '', carbs: '', calories: '', type: '' } });
    };

    render() {
        const { isOpen, onRequestClose, foodTypes } = this.props;
        const { newFood } = this.state;

        return (
            <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
                <h2>Add Food</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={newFood.name}
                    onChange={this.handleInputChange}
                />
                <input
                    type="number"
                    name="carbs"
                    placeholder="Carbs"
                    value={newFood.carbs}
                    onChange={this.handleInputChange}
                />
                <input
                    type="number"
                    name="calories"
                    placeholder="Calories"
                    value={newFood.calories}
                    onChange={this.handleInputChange}
                />
                <select name="type" value={newFood.type} onChange={this.handleInputChange}>
                    <option value="">Select Type</option>
                    {foodTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                <button onClick={this.handleAddFood}>Add Food</button>
                <button onClick={onRequestClose}>Cancel</button>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => ({
    foodTypes: state.foods.foodTypes
});

const mapDispatchToProps = (dispatch) => ({
    addFood: (food) => dispatch({ type: ADD_FOOD_REQUEST, payload: food }),
    fetchFoodTypes: () => dispatch({ type: FETCH_FOOD_TYPES_REQUEST })
});

export default connect(mapStateToProps, mapDispatchToProps)(AddFoodModal);
