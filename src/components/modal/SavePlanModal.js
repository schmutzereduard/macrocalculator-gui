import React, { Component } from 'react';
import { connect } from "react-redux";
import * as planActions from "../../store/actions/planActions";
import * as modalActions from "../../store/actions/modal/delete";
import Modal from 'react-modal';

class SavePlanModal extends Component {
    confirmSaveFood = () => {
        const { plan } = this.props;
        this.props.onSavePlan(plan);
        this.props.onRequestClose();
    };

    render() {
        const { isOpen, onRequestClose } = this.props;

        return (
            <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
                <h2>Confirm Save</h2>
                <p>Save changes to this plan?</p>
                <button onClick={this.confirmSavePlan}>Delete</button>
                <button onClick={onRequestClose}>Cancel</button>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => ({
    isOpen: state.insertModal.isSavePlanModalOpen
});

const mapDispatchToProps = (dispatch) => ({
    onDeleteFood: (id) => dispatch(foodActions.deleteFood(id)),
    onRequestClose: () => dispatch(modalActions.hideDeleteFoodModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteFoodModal);
} 