import React, { Component } from "react";
import { connect } from "react-redux";
import * as foodActions from "../../store/actions/foodActions";
import * as modalActions from "../../store/actions/modal/edit";
import Modal from "react-modal";

class EditFoodModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editingFood: props.food || { name: '', carbs: '', calories: '', type: '' }
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.food !== this.props.food) {
            this.setState({ editingFood: this.props.food });
        }
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            editingFood: { ...this.state.editingFood, [name]: value }
        });
    };

    handleUpdateFood = () => {
        this.props.onUpdateFood(this.state.editingFood);
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
    foodTypes: state.foods.foodTypes,
    isOpen: state.editModal.isEditFoodModalOpen
});

const mapDispatchToProps = (dispatch) => ({
    onUpdateFood: (food) => dispatch(foodActions.updateFood(food)),
    onRequestClose: () => dispatch(modalActions.hideEditFoodModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(EditFoodModal);
