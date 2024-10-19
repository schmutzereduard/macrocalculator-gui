import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFood } from "../../features/foodsSlice";
import ReactModal from "react-modal";
import SaveChanges from "./SaveChanges";
import Loading from "../misc/Loading";

function Food({ onClose }) {
    const dispatch = useDispatch();
    const { selectedItem: food, itemTypes: foodTypes } = useSelector((state) => state.foods);
    const [editingFood, setEditingFood] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        setEditingFood({ ...food });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [food]);

    const foodChanged = () => {
        for (let key in editingFood) {
            if (editingFood[key] !== food[key])
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
            {food ? (
                <div className="modal-form">
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            defaultValue={food.name}
                            onChange={(e) => setEditingFood({ ...editingFood, name: e.target.value })}
                        />
                    </label>
                    <label>
                        Carbs per 100g:
                        <input
                            type="text"
                            name="carbs"
                            placeholder="Carbs per 100g"
                            defaultValue={food.carbs}
                            onChange={(e) => setEditingFood({ ...editingFood, carbs: e.target.value })}

                        />
                    </label>
                    <label>
                        Calories per 100g:
                        <input
                            type="text"
                            name="calories"
                            placeholder="Calories per 100g"
                            defaultValue={food.calories}
                            onChange={(e) => setEditingFood({ ...editingFood, calories: e.target.value })}
                        />
                    </label>
                    <label>
                        Type:
                        <select name="type"
                            defaultValue={food.type}
                            onChange={(e) => setEditingFood({ ...editingFood, type: e.target.value })}
                        >
                            <option value="">Select Type</option>
                            {foodTypes.map(type => (
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
                            defaultValue={food.comments}
                            onChange={(e) => setEditingFood({ ...editingFood, comments: e.target.value })}
                        />
                    </label>
                    <div className="modal-buttons">
                        <div>
                            <button onClick={handleSave}>Save</button>
                            <button onClick={handleClose}>Close</button>
                        </div>
                    </div>

                    <ReactModal isOpen={isModalOpen} onRequestClose={() => setModalOpen(false)}>
                        <SaveChanges onSave={onSave} onExit={onExit} />
                    </ReactModal>
                </div>
            ) : (
                <Loading />
            )}
        </div>
    );
}

export default Food;
