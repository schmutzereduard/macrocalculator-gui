import React, { Component } from 'react';
import { connect } from "react-redux";
import * as planActions from "../../store/actions/planActions";
import * as modalActions from "../../store/actions/modal/delete";
import Modal from 'react-modal';

class DeletePlanModal extends Component {
    confirmDeletePlan = () => {
        const { planId } = this.props;
        this.props.onDeletPlan(planId);
        this.props.onRequestClose();
    };

    render() {
        const { isOpen, onRequestClose } = this.props;

        return (
            <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this plan?</p>
                <button onClick={this.confirmDeletePlan}>Delete</button>
                <button onClick={onRequestClose}>Cancel</button>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => ({
    isOpen: state.deleteModal.isDeletePlanModalOpen
});

const mapDispatchToProps = (dispatch) => ({
    onDeletePlan: (id) => dispatch(planActions.deletePlan(id)),
    onRequestClose: () => dispatch(modalActions.hideDeleteRecipeModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteRecipeModal);
