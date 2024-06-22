import React, { Component } from "react";
import { connect } from "react-redux";
import * as foodActions from "../../store/actions/foodActions";
import * as modalActions from "../../store/actions/modal/edit";
import Modal from "react-modal";

class EditFoodModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editingFood: props.food || { name: '', carbs: '', calories: '', type: '', comments: '' }
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
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                contentLabel="Edit Food"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '300px', // Adjust the width as needed
                        padding: '20px'
                    }
                }}
            >
                <h2>Edit Food</h2>
                <div className="modal-form">
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={editingFood.name}
                            onChange={this.handleInputChange}
                        />
                    </label>
                    <label>
                        Carbs per 100g:
                        <input
                            type="text"
                            name="carbs"
                            placeholder="Carbs per 100g"
                            value={editingFood.carbs}
                            onChange={this.handleInputChange}
                        />
                    </label>
                    <label>
                        Calories per 100g:
                        <input
                            type="text"
                            name="calories"
                            placeholder="Calories per 100g"
                            value={editingFood.calories}
                            onChange={this.handleInputChange}
                        />
                    </label>
                    <label>
                        Type:
                        <select name="type" value={editingFood.type} onChange={this.handleInputChange}>
                            <option value="">Select Type</option>
                            {foodTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Comments:
                        <input
                            type="text"
                            name="comments"
                            placeholder="Comments"
                            value={editingFood.comments}
                            onChange={this.handleInputChange}
                        />
                    </label>
                </div>
                <div className="modal-buttons">
                    <button onClick={this.handleUpdateFood}>Save</button>
                    <button onClick={onRequestClose}>Cancel</button>
                </div>
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
