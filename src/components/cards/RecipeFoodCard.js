import React, { useReducer, useState } from "react";
import "./FoodCard.css";

function RecipeFoodCard({ recipeFood }) {

    const [editableQuantity, setEditableQuantity] = useState(recipeFood.quantity);

    const buttonsState = {
        green: "",
        red: "delete",
    };
    const buttonsReducer = (state, action) => {

        switch (action.type) {
            case "delete":
                return {green: "confirm", red: "cancel"};
            case "confirm":
                return {green: "", red: "delete"};
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

    return recipeFood && (
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
                {recipeFood.food.name}
            </div>
            <div className="recipe food-card-body">
                <input
                    type="number"
                    name="quantity"
                    value={editableQuantity}
                    onChange={(e) => setEditableQuantity(e.target.value)}
                    className="editable-input"
                />g
                <p>{recipeFood.food.type}</p>
            </div>
            <div className="recipe food-card-footer">
                <div className="macro-row">
                    <span>{computeMacro(recipeFood.food.carbs)} carbs</span>
                    <span>{0} fat</span>
                </div>
                <div className="macro-row">
                    <span>{0} protein</span>
                    <span>{computeMacro(recipeFood.food.calories)} kcal</span>
                </div>
            </div>
        </div>
    );
}

export default RecipeFoodCard;
