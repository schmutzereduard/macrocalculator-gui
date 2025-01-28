import React, {useState} from "react";
import "./RecipeFoodCard.css";

function KitchenFoodCard({ food, quantity, onAdd, setFoodQuantity }) {
    
    const [editableQuantity, setEditableQuantity] = useState(quantity);

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

    const handleQuantityChange = (quantity) => {
        setFoodQuantity({
            [food.id]: quantity
        });
        setEditableQuantity(quantity);
    }

    return food && (
        <div className="recipe food-card">
            {editableQuantity >= 1 && <button
                name="add"
                value={editableQuantity}
                onClick={(event) => onAdd(editableQuantity, food)}
                className="slide-button edit-button"
            >
                {computeButtonName("add")}
            </button>}
            <div className="recipe food-card-header">
                {food.name}
            </div>
            <div className="recipe food-card-body">
                <input
                    type="number"
                    name="quantity"
                    defaultValue={0}
                    value={editableQuantity}
                    onChange={(event) => handleQuantityChange(event.target.value)}
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

export default KitchenFoodCard;
