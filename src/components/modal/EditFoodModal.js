import React, { Component } from "react";
import { connect } from "react-redux";
import * as foodActions from "../../store/actions/foodActions";
import * as modalActions from "../../store/actions/modal/edit";
import Modal from "react-modal";

class EditFoodModal extends Component {

    render() {
    }
}

const mapStateToProps = (state) => ({
    
});

const mapDispatchToProps = (dispatch) => ({
    onUpdateFood: (food) => dispatch(foodActions.updateFood(food)),
    onCloseModal: () => dispatch(modalActions.hideEditFoodModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(EditFoodModal);
