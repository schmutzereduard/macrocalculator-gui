import React, { Component } from 'react';
import { connect } from "react-redux";
import * as recipeActions from "../../store/actions/recipeActions";
import * as modalActions from "../../store/actions/modal/delete";
import Modal from 'react-modal';

class DeleteRecipeModal extends Component {
    confirmDeleteRecipe = () => {
        const { recipeId } = this.props;
        this.props.onDeleteRecipe(recipeId);
        this.props.onRequestClose();
    };

    render() {
        const { isOpen, onRequestClose } = this.props;

        return (
            <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this recipe?</p>
                <button onClick={this.confirmDeleteRecipe}>Delete</button>
                <button onClick={onRequestClose}>Cancel</button>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => ({
    isOpen: state.deleteModal.isDeleteRecipeModalOpen
});

const mapDispatchToProps = (dispatch) => ({
    onDeleteRecipe: (id) => dispatch(recipeActions.deleteRecipe(id)),
    onRequestClose: () => dispatch(modalActions.hideDeleteRecipeModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteRecipeModal);
