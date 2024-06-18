import React, { Component } from "react";
import { connect } from "react-redux";
import * as foodActions from "../../store/actions/foodActions";
import * as modalActions from "../../store/actions/modal/delete";
import Modal from "react-modal";

class DeleteFoodModal extends Component {
    confirmDeleteFood = () => {
        const { foodId } = this.props;
        this.props.onDeleteFood(foodId);
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
    isOpen: state.deleteModal.isDeleteFoodModalOpen
});

const mapDispatchToProps = (dispatch) => ({
    onDeleteFood: (id) => dispatch(foodActions.deleteFood(id)),
    onRequestClose: () => dispatch(modalActions.hideDeleteFoodModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteFoodModal);
