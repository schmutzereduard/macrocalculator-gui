import { useState } from "react";

function useSearching(initialFilters = {}) {

    const [searchConfig, setSearchConfig] = useState(initialFilters);

    const parseCondition = (condition, value) => {
        if (!condition) return true;
        if (condition.startsWith('>=')) return value >= parseFloat(condition.substring(2));
        if (condition.startsWith('>')) return value > parseFloat(condition.substring(1));
        if (condition.startsWith('<=')) return value <= parseFloat(condition.substring(2));
        if (condition.startsWith('<')) return value < parseFloat(condition.substring(1));
        return value === parseFloat(condition);
    };

    const applyFilters = (item) => {
        // Adapt to different search properties dynamically
        return Object.keys(searchConfig).every(key => {
            const filterValue = searchConfig[key];
            if (!filterValue) return true;

            if (key === "name") {
                return item.name.toLowerCase().includes(filterValue.toLowerCase());
            } else if (["carbs", "calories", "totalCalories", "totalCarbs"].includes(key)) {
                return parseCondition(filterValue, item[key]);
            } else {
                return item[key]?.toLowerCase() === filterValue.toLowerCase();
            }
        });
    };

    const search = (items) => items.filter(applyFilters);

    const handleSearchChange = (updatedField) => {
        setSearchConfig(prevFilters => ({ ...prevFilters, ...updatedField }));
    };

    return { search, searchConfig, handleSearchChange };
}

export default useSearching;
