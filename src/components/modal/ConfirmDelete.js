function ConfirmDelete({ name, onConfirm, onCancel }) {

    return (
        <div>
            <h2>Confirm Delete</h2>
            <p>Do you want to delete {name} ? </p>
            <div className="modal-buttons">
                <button onClick={onConfirm}>Confirm</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
}

export default ConfirmDelete;