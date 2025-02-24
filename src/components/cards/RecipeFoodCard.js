import React, { useReducer, useState } from "react";
import "./RecipeFoodCard.css";

function RecipeFoodCard({ food, quantity, onQuantityUpdate, onDelete }) {

    const [editableQuantity, setEditableQuantity] = useState(quantity);

    const buttonsState = {
        green: "",
        red: "delete",
    };
    const buttonsReducer = (state, action) => {

        switch (action.type) {
            case "delete":
                return {green: "confirm", red: "cancel"};
            case "confirm": {
                onDelete(food.id);
                return {green: "", red: "delete"};
            }
            case "cancel":
                return {green: "", red: "delete"};
            default:
                return {green: "", red: "delete"};
        }
    };
    const [state, dispatch] = useReducer(buttonsReducer, buttonsState);

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

    const computeMacro = (value) => {
        return editableQuantity / 100 * value;
    };

    const handleQuantityUpdate = (event) => {
        const newQuantity = event.target.value;
        setEditableQuantity(newQuantity);
        onQuantityUpdate(newQuantity, food);
    }

    return food && (
        <div className="recipe food-card">
            {state.green && <button
                name={state.green}
                onClick={(event) => dispatch({ type: event.target.name })}
                className="slide-button edit-button"
            >
                {computeButtonName(state.green)}
            </button>}
            <button
                onClick={(event) => dispatch({ type: event.target.name })}
                name={state.red}
                className="slide-button delete-button"
            >
                {computeButtonName(state.red)}
            </button>
            <div className="recipe food-card-header">
                {food.name}
            </div>
            <div className="recipe food-card-body">
                <input
                    type="number"
                    name="quantity"
                    defaultValue={100}
                    value={editableQuantity}
                    onChange={handleQuantityUpdate}
                    className="editable-input"
                />g
                <p>{food.type}</p>
            </div>
            <div className="recipe food-card-footer">
                <div className="macro-row">
                    <span>{computeMacro(food.carbs)} carbs</span>
                    <span>{0} fat</span>
                </div>
                <div className="macro-row">
                    <span>{0} protein</span>
                    <span>{computeMacro(food.calories)} kcal</span>
                </div>
            </div>
        </div>
    );
}

export default RecipeFoodCard;
