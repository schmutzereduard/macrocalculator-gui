import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addFood, updateFood} from "../../features/foodsSlice";
import ReactModal from "react-modal";
import SaveChanges from "./SaveChanges";
import Loading from "../misc/Loading";
import useModals from "../../hooks/useModals";

function Food({ food, onClose }) {

    const dispatch = useDispatch();
    const { itemTypes: foodTypes } = useSelector((state) => state.foods);
    const { modalConfig, setModalConfig } = useModals();

    const [ editingFood, setEditingFood ] = useState(null);
    const [ alert, setAlert ] = useState("");


    useEffect(() => {
        setEditingFood({...food});
    }, [food]);


    const foodValid = () => {

        return editingFood
            && editingFood.name !== ""
            && editingFood.carbs !== ""
            && editingFood.calories !== ""
            && editingFood.type;
    };

    const foodChanged = () => {

        for (let key in editingFood) {
            if (editingFood[key] !== food[key])
                return true;
        }

        return false;
    };

    const onSave = () => {

        if (!editingFood.id) {
            dispatch(addFood(editingFood));
        } else {
            dispatch(updateFood(editingFood));
        }
        onClose();
    };

    const onExit = () => {

        setModalConfig({
            ...modalConfig,
            isSaveItemModalOpen: false
        })
        onClose();
    };

    const handleSave = () => {

        if (foodChanged()) {
            onSave();
        } else {
            onClose();
        }
    };

    const handleClose = () => {

        if (foodChanged() && foodValid()) {
            setModalConfig({
                ...modalConfig,
                isSaveItemModalOpen: true
            });
        } else {
            onExit();
        }
    };

    const handleInputChange = (e) => {

        const {name, value} = e.target;
        setEditingFood({
            ...editingFood,
            [name]: value
        });
    };

    const showAlert = () => {

        if (editingFood.name === "") {
            setAlert("Please enter a name");
        } else if (editingFood.carbs === "") {
            setAlert("Please enter carbs");
        } else if (editingFood.calories === "") {
            setAlert("Please enter calories");
        } else if (!editingFood.type) {
            setAlert("Please select a type");
        } else {
            setAlert("");
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
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Carbs per 100g:
                        <input
                            type="number"
                            name="carbs"
                            placeholder="Carbs per 100g"
                            defaultValue={food.carbs}
                            onChange={handleInputChange}

                        />
                    </label>
                    <label>
                        Calories per 100g:
                        <input
                            type="number"
                            name="calories"
                            placeholder="Calories per 100g"
                            defaultValue={food.calories}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Type:
                        <select name="type"
                                defaultValue={food.type}
                                onChange={handleInputChange}
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
                            onChange={handleInputChange}
                        />
                    </label>
                    <div className="modal-buttons">
                        <div>
                            <span
                                onMouseEnter={showAlert}
                                onMouseLeave={() => setAlert("")}
                            ><button
                                onClick={handleSave}
                                disabled={!foodValid()}
                            >
                                Save
                            </button>
                            </span>
                            <button onClick={handleClose}>Close</button>
                            <div>{alert}</div>
                        </div>
                    </div>

                    <ReactModal
                        isOpen={modalConfig.isSaveItemModalOpen}
                        onRequestClose={onExit}>
                        <SaveChanges
                            onSave={onSave}
                            onExit={onExit}
                        />
                    </ReactModal>
                </div>
            ) : (
                <Loading/>
            )}
        </div>
    );
}

export default Food;
