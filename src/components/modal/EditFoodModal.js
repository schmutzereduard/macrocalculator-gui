import React, { Component } from "react";
import { connect } from "react-redux";
import { UPDATE_FOOD_REQUEST, FETCH_FOOD_TYPES_REQUEST } from "../../store/actions/actionTypes";
import Modal from "react-modal";

class EditFoodModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editingFood: this.props.food || { name: '', carbs: '', calories: '', type: '' }
        };
    }

    componentDidMount() {
        this.props.fetchFoodTypes();
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            editingFood: { ...this.state.editingFood, [name]: value }
        });
    };

    handleUpdateFood = () => {
        this.props.updateFood(this.state.editingFood);
        this.props.onRequestClose();
    };

    render() {
        const { isOpen, onRequestClose, foodTypes } = this.props;
        const { editingFood } = this.state;

        return (
            <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
                <h2>Edit Food</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={editingFood.name}
                    onChange={this.handleInputChange}
                />
                <input
                    type="number"
                    name="carbs"
                    placeholder="Carbs"
                    value={editingFood.carbs}
                    onChange={this.handleInputChange}
                />
                <input
                    type="number"
                    name="calories"
                    placeholder="Calories"
                    value={editingFood.calories}
                    onChange={this.handleInputChange}
                />
                <select name="type" value={editingFood.type} onChange={this.handleInputChange}>
                    <option value="">Select Type</option>
                    {foodTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                <button onClick={this.handleUpdateFood}>Save</button>
                <button onClick={onRequestClose}>Cancel</button>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => ({
    foodTypes: state.foods.foodTypes
});

const mapDispatchToProps = (dispatch) => ({
    updateFood: (food) => dispatch({ type: UPDATE_FOOD_REQUEST, payload: food }),
    fetchFoodTypes: () => dispatch({ type: FETCH_FOOD_TYPES_REQUEST })
});

export default connect(mapStateToProps, mapDispatchToProps)(EditFoodModal);
