import React, { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteFood, fetchFoodTypes, updateFood, addFood } from "../../store/foodsSlice";
import "./FoodCard.css";

function FoodCard({ food, onCancel }) {

    const [editableFood, setEditableFood] = useState({ ...food });
    const [alertMessage, setAlertMessage] = useState("");
    const foodChanged = () => {

        for (let key in editableFood) {
            if (editableFood[key] !== food[key]) return true;
        }
        return false;
    };
    const foodValid = () => {

        if (editableFood.name === ""){
            setAlertMessage("Name is required");
            return false;
        }

        if (editableFood.type === null || editableFood.type === "SELECT TYPE") {
            setAlertMessage("Type is required");
            return false;
        }

        setAlertMessage("")
        return true;
    };
    const { itemTypes: foodTypes } = useSelector(state => state.foods);
    const generalDispatch = useDispatch();

    const buttonsState = {
        green: onCancel !== null ? "save" : "edit",
        red: onCancel !== null ? "cancel" : "delete",
    };
    const buttonsReducer = (state, action) => {

        switch (action.type) {
            case "edit":
                return {green: "save", red: "cancel"};
            case "save": {
                if (foodChanged() || food.id === null) {
                    if (foodValid()) {
                        if (food.id === null)
                            generalDispatch(addFood(editableFood));
                        else
                            generalDispatch(updateFood(editableFood));
                    } else {
                        return {...state};
                    }
                }
                return {green: "edit", red: "delete"};
            }
            case "delete":
                return {green: "confirm", red: "cancel"};
            case "confirm": {
                generalDispatch(deleteFood(editableFood.id));
                return {green: "edit", red: "delete"};
            }
            case "cancel": {
                setAlertMessage("");
                setEditableFood({...food});
                if (onCancel)
                    onCancel();
                return {green: "edit", red: "delete"};
            }
            default:
                return {green: "edit", red: "delete"};
        }
    };
    const [state, dispatch] = useReducer(buttonsReducer, buttonsState);

    useEffect(() => {
        if (foodTypes.length === 0) {
            generalDispatch(fetchFoodTypes());
        }
    }, [generalDispatch, foodTypes]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableFood((prev) => ({ ...prev, [name]: value }));
    };

    const computeButtonName = (name) => {
        return name
            .split("")
            .map((letter, index) => (
                <React.Fragment key={index}>
                    {letter}
                    <br />
                </React.Fragment>
            ));
    };

    return (
        <div className="food-card">
            <button
                name={state.green}
                onClick={(event) => dispatch({ type: event.target.name })}
                className="slide-button edit-button"
            >
                {computeButtonName(state.green)}
            </button>
            <button
                onClick={(event) => dispatch({ type: event.target.name })}
                name={state.red}
                className="slide-button delete-button"
            >
                {computeButtonName(state.red)}
            </button>
            {alertMessage && <div className={"alert-message"}>{alertMessage}</div>}
            <div className="food-card-header">
                {state.green === "save" ? (
                    <input
                        type="text"
                        name="name"
                        value={editableFood.name}
                        onChange={handleInputChange}
                        className="editable-input"
                    />
                ) : (
                    food.name
                )}
            </div>
            <div className="food-card-body">
                {state.green === "save" ? (
                    <>
                        {food.quantity ? (
                            <input
                                type="number"
                                name="quantity"
                                value={editableFood.quantity}
                                onChange={handleInputChange}
                                className="editable-input"
                            />) : (
                            <p>100g</p>
                        )}
                        <select
                            name="type"
                            defaultValue={food.type == null ? "SELECT TYPE" : food.type}
                            className="editable-select"
                            onChange={handleInputChange}
                        >
                            <option>SELECT TYPE</option>
                            {foodTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </>
                ) : (
                    <>
                        <p>{food.quantity || 100}g</p>
                        <p>{food.type}</p>
                    </>
                )}
            </div>
            <div className="food-card-footer">
                <div className="macro-row">
                    {state.green === "save" ? (
                        <>
                            <input
                                type="number"
                                name="carbs"
                                value={editableFood.carbs || 0}
                                onChange={handleInputChange}
                                className="editable-input"
                            /><span>carbs</span>
                            <input
                                type="number"
                                name="fat"
                                value={editableFood.fat || 0}
                                onChange={handleInputChange}
                                className="editable-input"
                            /><span>fat</span>
                        </>
                    ) : (
                        <>
                            <span>{food.carbs} carbs</span>
                            <span>{food.fat || 0} fat</span>
                        </>
                    )}
                </div>
                <div className="macro-row">
                    {state.green === "save" ? (
                        <>
                            <input
                                type="number"
                                name="protein"
                                value={editableFood.protein || 0}
                                onChange={handleInputChange}
                                className="editable-input"
                            /><span>protein</span>
                            <input
                                type="number"
                                name="calories"
                                value={editableFood.calories || 0}
                                onChange={handleInputChange}
                                className="editable-input"
                            /><span>kcal</span>
                        </>
                    ) : (
                        <>
                            <span>{food.protein || 0} protein</span>
                            <span>{food.calories} kcal</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FoodCard;
