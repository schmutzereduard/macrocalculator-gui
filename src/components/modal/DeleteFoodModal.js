import React, { Component } from "react";
import { connect } from "react-redux";
import * as foodActions from "../../store/actions/foodActions";
import * as modalActions from "../../store/actions/modal/delete";
import Modal from "react-modal";

class DeleteFoodModal extends Component {

    render() {
    }
}

const mapStateToProps = (state) => ({
    
});

const mapDispatchToProps = (dispatch) => ({
    onDeleteFood: (id) => dispatch(foodActions.deleteFood(id)),
    onCloseModal: () => modalActions.hidedeleteFoodModal()
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteFoodModal);
