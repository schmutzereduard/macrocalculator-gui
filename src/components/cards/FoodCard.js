import React, { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteFood, fetchFoodTypes, updateFood } from "../../store/foodsSlice";
import "./FoodCard.css";

const buttonsState = {
    green: "edit",
    red: "delete"
};

function buttonsReducer(state, action) {

    switch (action.type) {
        case "edit":
            return {green: "save", red: "cancel"};
        case "save":
            return {green: "edit", red: "delete"};
        case "delete":
            return {green: "confirm", red: "cancel"};
        case "confirm":
        case "cancel":
        default:
            return {green: "edit", red: "delete"};
    }
}

const FoodCard = ({ food }) => {

    const [state, dispatch] = useReducer(buttonsReducer, buttonsState);
    const [editableFood, setEditableFood] = useState({ ...food });
    const { itemTypes: foodTypes } = useSelector(state => state.foods);
    const generalDispatch = useDispatch();

    useEffect(() => {
        if (foodTypes.length === 0) {
            generalDispatch(fetchFoodTypes());
        }
    }, [generalDispatch, foodTypes]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableFood((prev) => ({ ...prev, [name]: value }));
    };

    const handleButtonClick = (event) => {
        const { name } = event.target;

        if (name === "save") {
            generalDispatch(updateFood(editableFood));
        }

        if (name === "confirm") {
            generalDispatch(deleteFood(editableFood.id));
        }

        dispatch({ type: name });
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
                onClick={handleButtonClick}
                className="slide-button edit-button"
            >
                {computeButtonName(state.green)}
            </button>
            <button
                onClick={handleButtonClick}
                name={state.red}
                className="slide-button delete-button"
            >
                {computeButtonName(state.red)}
            </button>
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
                            defaultValue={food.type}
                            className="editable-select"
                            onChange={handleInputChange}
                        >
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
};

export default FoodCard;
