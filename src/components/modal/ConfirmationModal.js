import React from 'react';
import Modal from 'react-modal';

const ConfirmationModal = ({ isOpen, onRequestClose, onConfirm, message }) => (
    <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Confirmation"
        style={{
            content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                width: '400px',
                padding: '20px'
            }
        }}
    >
        <h2>Confirmation</h2>
        <p>{message}</p>
        <div className="modal-buttons">
            <button onClick={onConfirm}>Yes</button>
            <button onClick={onRequestClose}>No</button>
        </div>
    </Modal>
);

export default ConfirmationModal;
