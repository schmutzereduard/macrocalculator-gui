import React, { Component } from 'react';
import Modal from 'react-modal';

class ConfirmDeleteModal extends Component {
    render() {
        const { isOpen, onRequestClose, onConfirm, message } = this.props;
        return (
            <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Confirm Delete">
                <h2>Confirm Delete</h2>
                <p>{message}</p>
                <div className="modal-buttons">
                    <button onClick={onConfirm}>Delete</button>
                    <button onClick={onRequestClose}>Cancel</button>
                </div>
            </Modal>
        );
    }
}

export default ConfirmDeleteModal;
