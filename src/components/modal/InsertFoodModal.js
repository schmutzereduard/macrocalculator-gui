import React, { Component } from "react";
import { connect } from "react-redux";
import * as foodActions from "../../store/actions/foodActions";
import * as modalActions from "../../store/actions/modal/insert";
import Modal from "react-modal";

class InsertFoodModal extends Component {

    render() {
    }
}

const mapStateToProps = (state) => ({
    
});

const mapDispatchToProps = (dispatch) => ({
    onAddFood: (food) => dispatch(foodActions.addFood(food)),
    onCloseModal: () => dispatch(modalActions.hideInsertFoodModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(InsertFoodModal);
