function SaveChanges({ onSave, onExit }) {

    return (
        <div>
            <h2>Save Changes</h2>
            <p>You have unsaved changes. Do you want to save them and exit?</p>
            <div className="modal-buttons">
                <div>
                    <button onClick={onSave}>Save</button>
                    <button onClick={onExit}>Exit</button>
                </div>
            </div>
        </div>
    );
}

export default SaveChanges;