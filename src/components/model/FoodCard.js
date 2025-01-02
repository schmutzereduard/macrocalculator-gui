import React from "react";
import "./FoodCard.css";

const FoodCard = ({ food, onClick }) => {
    return (
        <div className="food-card" onClick={() => onClick(food)}>
            <div className="food-card-header">{food.name}</div>
            <div className="food-card-body">
                <p>Quantity: 100g</p>
                <p>Type: {food.type}</p>
                <p>Description: {food.name}</p>
            </div>
            <div className="food-card-footer">
                <div className="macro-row">
                    <span>{food.carbs} carbs</span>
                    <span>{food.fat || 0} fat</span>
                </div>
                <div className="macro-row">
                    <span>{food.protein || 0} protein</span>
                    <span>{food.calories} kcal</span>
                </div>
            </div>
        </div>
    );
};

export default FoodCard;
