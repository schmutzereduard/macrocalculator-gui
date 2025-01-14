import React from "react";
import { useSelector } from "react-redux";
import "./FoodFilter.css";

function FoodFilter({ filterConfig, handleFilterChange, handlePageChange, totalItems, onClose }) {

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
                    <h2 className="title" onClick={onClose}> Filter Foods </h2>
                </div>
                <input
                    type="text"
                    placeholder="Carbs"
                    name="carbs"
                    value={filterConfig.carbs || ""}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    placeholder="Calories"
                    name="calories"
                    value={filterConfig.calories || ""}
                    onChange={handleInputChange}
                />
                <select
                    name="type"
                    value={filterConfig.type || ""}
                    onChange={handleInputChange}
                >
                    <option value="">Any</option>
                    {foodTypes && foodTypes.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Comments"
                    name="comments"
                    value={filterConfig.comments || ""}
                    onChange={handleInputChange}
                />
                <label className="matches">Matches: {totalItems}</label>
            </div>
        </div>
    );
}

export default FoodFilter;
