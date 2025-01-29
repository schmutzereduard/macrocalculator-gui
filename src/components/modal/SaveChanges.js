import "./SaveChanges.css";

function SaveChanges({ onSave, onExit }) {
    return (
        <div className="save-modal">
            <h2 className="modal-title">Save Changes</h2>
            <p className="modal-text">You have unsaved changes</p>
            <p className="modal-text">Do you want to save them and exit?</p>
            <div className="modal-buttons">
                <button className="save" onClick={onSave}>Save</button>
                <button className="exit" onClick={onExit}>Exit</button>
            </div>
        </div>
    );
}

export default SaveChanges;
