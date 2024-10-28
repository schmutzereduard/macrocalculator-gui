import { useState } from "react";

function useSorting() {
    const [sortConfig, setSortConfig] = useState({
        key: '',
        direction: '',
        icon: ''
    });

    const handleSortChange = (key) => {
        let direction;
        let icon;

        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
            icon = '↓';
        } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
            direction = '';
            icon = '';
            key = '';
        } else {
            direction = 'ascending';
            icon = '↑';
        }

        setSortConfig({ key, direction, icon });
    };

    const sort = (items) => {
        return [...items].sort((a, b) => {
            if (sortConfig.key) {
                if (sortConfig.direction === 'ascending') {
                    return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
                } else if (sortConfig.direction === 'descending') {
                    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
                }
            }
            return 0;
        });
    }

    return { sortConfig, handleSortChange, sort };
}

export default useSorting;