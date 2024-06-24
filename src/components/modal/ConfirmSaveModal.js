import React, { Component } from 'react';
import Modal from 'react-modal';

class ConfirmSaveModal extends Component {
    render() {
        const { isOpen, onRequestClose, onConfirm, message } = this.props;
        return (
            <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Confirm Save">
                <h2>Save Changes</h2>
                <p>{message}</p>
                <div className="modal-buttons">
                    <button onClick={() => onConfirm(true)}>Yes</button>
                    <button onClick={() => onConfirm(false)}>No</button>
                </div>
            </Modal>
        );
    }
}

export default ConfirmSaveModal;
