import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFood } from "../../features/foodsSlice";
import ReactModal from "react-modal";

function Food({ onClose }) {
    const dispatch = useDispatch();
    const { selectedItem, itemTypes } = useSelector((state) => state.foods);
    const [editingFood, setEditingFood] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        setEditingFood({ ...selectedItem });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedItem]);

    const foodChanged = () => {
        for (let key in editingFood) {
            if (editingFood[key] !== selectedItem[key])
                return true;
        }

        return false;
    }

    const onSave = () => {
        dispatch(updateFood(editingFood));
        onClose();
    }
    const onExit = () => {
        setModalOpen(false);
        onClose();
    }

    const handleSave = () => {
        if (foodChanged()) {
            onSave();
        } else {
            onClose();
        }
    }

    const handleClose = () => {
        if (foodChanged()) {
            setModalOpen(true);
        } else {
            onExit();
        }
    }

    return (
        <div>
            <h2>Edit Food</h2>
            {selectedItem ? (
                <div className="modal-form">
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            defaultValue={selectedItem.name}
                            onChange={(e) => setEditingFood({ ...editingFood, name: e.target.value })}
                        />
                    </label>
                    <label>
                        Carbs per 100g:
                        <input
                            type="text"
                            name="carbs"
                            placeholder="Carbs per 100g"
                            defaultValue={selectedItem.carbs}
                            onChange={(e) => setEditingFood({ ...editingFood, carbs: e.target.value })}

                        />
                    </label>
                    <label>
                        Calories per 100g:
                        <input
                            type="text"
                            name="calories"
                            placeholder="Calories per 100g"
                            defaultValue={selectedItem.calories}
                            onChange={(e) => setEditingFood({ ...editingFood, calories: e.target.value })}
                        />
                    </label>
                    <label>
                        Type:
                        <select name="type"
                            defaultValue={selectedItem.type}
                            onChange={(e) => setEditingFood({ ...editingFood, type: e.target.value })}
                        >
                            <option value="">Select Type</option>
                            {itemTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Comments:
                        <input
                            type="text"
                            name="comments"
                            placeholder="Comments"
                            defaultValue={selectedItem.comments}
                            onChange={(e) => setEditingFood({ ...editingFood, comments: e.target.value })}
                        />
                    </label>
                    <div className="modal-buttons">
                        <button onClick={handleSave}>Save</button>
                        <button onClick={handleClose}>Close</button>
                    </div>

                    <ReactModal isOpen={isModalOpen} onRequestClose={() => setModalOpen(false)}>
                        <SaveChangesModal onSave={onSave} onExit={onExit} />
                    </ReactModal>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

function SaveChangesModal({ onSave, onExit }) {

    return (
        <div>
            <h2>Save Changes</h2>
            <p>You have unsaved changes. Do you want to save them and exit?</p>
            <div className="modal-buttons">
                <button onClick={onSave}>Save</button>
                <button onClick={onExit}>Exit</button>
            </div>
        </div>
    );
}

export default Food;
