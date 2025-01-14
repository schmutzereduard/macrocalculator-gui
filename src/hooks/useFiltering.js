import { useState } from "react";

function useFiltering() {

    const [filterConfig, setFilterConfig] = useState({});

    const parseCondition = (condition, value) => {
        if (!condition) return true;
        if (condition.startsWith('>=')) return value >= parseFloat(condition.substring(2));
        if (condition.startsWith('>')) return value > parseFloat(condition.substring(1));
        if (condition.startsWith('<=')) return value <= parseFloat(condition.substring(2));
        if (condition.startsWith('<')) return value < parseFloat(condition.substring(1));
        return value === parseFloat(condition);
    };

    const applyFilters = (item) => {

        return Object.keys(filterConfig).every(key => {
            const filterValue = filterConfig[key];
            if (!filterValue) return true;

            if (["name", "type"].includes(key)) {
                return item[key].toLowerCase().includes(filterValue.toLowerCase());
            } else if (["carbs", "calories", "totalCalories", "totalCarbs"].includes(key)) {
                return parseCondition(filterValue, item[key]);
            } else if (["foodName", "foodType"].includes(key)) {
                const foodKey = key.replace("food", "").toLowerCase();
                return item["recipeFoods"].some(recipeFood => recipeFood.food[foodKey].toLowerCase().includes(filterValue.toLowerCase()));
            } else {
                return item[key]?.toLowerCase() === filterValue.toLowerCase();
            }
        });
    };

    const filter = (items) => items.filter(applyFilters);

    const handleFilterChange = (config) => {
        setFilterConfig({ ...config });
    };

    return { filter, filterConfig, handleFilterChange };
}

export default useFiltering;
