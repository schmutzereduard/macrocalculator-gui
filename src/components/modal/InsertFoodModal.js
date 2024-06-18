import React, { Component } from "react";
import { connect } from "react-redux";
import * as foodActions from "../../store/actions/foodActions";
import * as modalActions from "../../store/actions/modal/insert";
import Modal from "react-modal";

class InsertFoodModal extends Component {
    
    state = {
        newFood: { name: '', carbs: '', calories: '', type: '' }
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            newFood: { ...this.state.newFood, [name]: value }
        });
    };

    handleAddFood = () => {
        this.props.onAddFood(this.state.newFood);
        this.props.onCloseModal();
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
    foodTypes: state.foods.foodTypes,
    isOpen: state.insertModal.isInsertFoodModalOpen
});

const mapDispatchToProps = (dispatch) => ({
    onAddFood: (food) => dispatch(foodActions.addFood(food)),
    onCloseModal: () => dispatch(modalActions.hideInsertFoodModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(InsertFoodModal);
