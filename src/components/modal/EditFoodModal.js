import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import * as foodActions from "../../store/actions/foodActions";
import * as editActions from "../../store/actions/modal/edit";
import * as insertActions from "../../store/actions/modal/insert";
import ConfirmSaveModal from "../modal/ConfirmSaveModal";

class EditFoodModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editingFood: props.food || { name: '', carbs: '', calories: '', type: '', comments: '' },
            changesMade: false
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.food !== this.props.food) {
            this.setState({
                editingFood: this.props.food || { name: '', carbs: '', calories: '', type: '', comments: '' },
                changesMade: false // Reset changes made when a new food is loaded
            });
        }
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            editingFood: { ...this.state.editingFood, [name]: value },
            changesMade: true
        });
    };

    handleUpdateFood = () => {
        this.props.onUpdateFood(this.state.editingFood);
        this.props.onRequestClose();
    };

    handleModalClose = () => {
        if (this.state.changesMade) {
            this.props.showSaveChangesModal();
        } else {
            this.props.onRequestClose();
        }
    };

    confirmSaveChanges = (saveChanges) => {
        if (saveChanges) {
            this.handleUpdateFood();
        } else {
            this.setState({
                editingFood: this.props.food || { name: '', carbs: '', calories: '', type: '', comments: '' },
                changesMade: false
            });
            this.props.onRequestClose();
        }
        this.props.hideSaveChangesModal();
    };

    render() {
        const { isOpen, foodTypes, isSaveChangesFoodModalOpen } = this.props;
        const { editingFood } = this.state;

        return (
            <Modal
                isOpen={isOpen}
                onRequestClose={this.handleModalClose}
                contentLabel="Edit Food"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '300px',
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
                    <button onClick={this.handleModalClose}>Close</button>
                </div>
                {isSaveChangesFoodModalOpen && (
                    <ConfirmSaveModal
                        isOpen={isSaveChangesFoodModalOpen}
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
    foodTypes: state.foods.foodTypes,
    isOpen: state.editModal.isEditFoodModalOpen,
    isSaveChangesFoodModalOpen: state.insertModal.isSaveFoodChangesModalOpen
});

const mapDispatchToProps = (dispatch) => ({
    onUpdateFood: (food) => dispatch(foodActions.updateFood(food)),
    onRequestClose: () => dispatch(editActions.hideEditFoodModal()),
    showSaveChangesModal: () => dispatch(insertActions.showSaveFoodChangesModal()),
    hideSaveChangesModal: () => dispatch(insertActions.hideSaveFoodChangesModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(EditFoodModal);
