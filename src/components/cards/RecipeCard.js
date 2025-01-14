import React, { useReducer } from "react";
import "./RecipeCard.css";

function RecipeCard({ recipe }) {

    const buttonsState = {
        green: "edit",
        red: "delete"
    };
    const buttonsReducer = (state, action) => {

        switch (action.type) {
            case "edit":
                return {green: "save", red: "cancel"};
            case "save":
                return {green: "edit", red: "delete"};
            case "delete":
                return {green: "confirm", red: "cancel"};
            case "confirm":
                return {green: "edit", red: "delete"};
            case "cancel":
                return {green: "edit", red: "delete"};
            default:
                return {green: "edit", red: "delete"};
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

    return (
        <div className="recipe-card">
            <button
                name={state.green}
                onClick={(event) => dispatch({type: event.target.name})}
                className="slide-button edit-button"
            >
                {computeButtonName(state.green)}
            </button>
            <button
                onClick={(event) => dispatch({type: event.target.name})}
                name={state.red}
                className="slide-button delete-button"
            >
                {computeButtonName(state.red)}
            </button>
            <div className="recipe-card-header">
                {recipe.name}
            </div>
            <div className="recipe-card-body">
                <p>{recipe.totalWeight}g</p>
                <p>{recipe.description || recipe.name}</p>
            </div>
            <div className="recipe-card-footer">
                <div className="macro-row">
                    <span>{recipe.totalCarbs} carbs</span>
                    <span>{recipe.fat || 0} fat</span>
                </div>
                <div className="macro-row">
                    <span>{recipe.protein || 0} protein</span>
                    <span>{recipe.totalCalories} kcal</span>
                </div>
            </div>
        </div>
    );
}

export default RecipeCard;