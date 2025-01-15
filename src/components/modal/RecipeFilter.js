import {useSelector} from "react-redux";
import React from "react";

function RecipeFilter({ filterConfig, handleFilterChange, handlePageChange, totalItems, onClose }) {

    const { itemTypes: foodTypes } = useSelector(state => state.foods);

    const handleInputChange = (e) => {

        const { name, value } = e.target;
        handleFilterChange({ ...filterConfig, [name]: value });
        handlePageChange(1);
    };

    const handleClear = () => {
        handleFilterChange({});
    };

    return (
        <div className="filter-modal">
            <div className="filter-modal-content">
                <div className="filter-modal-header">
                    <button className="clear-button" onClick={handleClear}>Clear</button>
                    <h2 className="title" onClick={onClose}> Filter Recipes </h2>
                </div>
                <input
                    type="text"
                    placeholder="Carbs"
                    name="totalCarbs"
                    value={filterConfig.totalCarbs || ""}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    placeholder="Calories"
                    name="totalCalories"
                    value={filterConfig.totalCalories || ""}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    placeholder="Food name"
                    name="foodName"
                    value={filterConfig.foodName || ""}
                    onChange={handleInputChange}
                />
                <select
                    name="foodType"
                    value={filterConfig.foodType || ""}
                    onChange={handleInputChange}
                >
                    <option value="">Food Type</option>
                    {foodTypes && foodTypes.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Description"
                    name="description"
                    value={filterConfig.description || ""}
                    onChange={handleInputChange}
                />
                <label className="matches">Matches: {totalItems}</label>
            </div>
        </div>
    );
}

export default RecipeFilter;