import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFoods, fetchFoodTypes, addFood } from '../../features/foodsSlice';

function Foods () {

    const dispatch = useDispatch();
    const { items, itemTypes, loading } = useSelector(state => state.foods);

    const [editingFood, setEditingFood] = useState(null);
    const [deletingFood, setDeletingFood] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [newFood, setNewFood] = useState({ name: '', carbs: '', calories: '', type: '', comments: '' });

    useEffect(() => {
        dispatch(fetchFoods());
        dispatch(fetchFoodTypes());
    }, [dispatch]);

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
            direction = '';
        } else {
            direction = 'ascending';
        }
        setSortConfig({ key, direction });
    };

    const sortedFoods = [...items].sort((a, b) => {
        if (sortConfig.key) {
            if (sortConfig.direction === 'ascending') {
                return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
            } else if (sortConfig.direction === 'descending') {
                return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
            }
        }
        return 0;
    });

    const parseCondition = (condition, value) => {
        if (!condition) return true;
        if (condition.startsWith('>=')) return value >= parseFloat(condition.substring(2));
        if (condition.startsWith('>')) return value > parseFloat(condition.substring(1));
        if (condition.startsWith('<=')) return value <= parseFloat(condition.substring(2));
        if (condition.startsWith('<')) return value < parseFloat(condition.substring(1));
        return value === parseFloat(condition);
    };

    const filteredFoods = sortedFoods.filter(food => {
        const nameFilter = newFood.name ? food.name.toLowerCase().includes(newFood.name.toLowerCase()) : true;
        const typeFilter = newFood.name ? true : (newFood.type ? food.type.toLowerCase() === newFood.type.toLowerCase() : true);
        const carbsFilter = newFood.name ? true : parseCondition(newFood.carbs, food.carbs);
        const caloriesFilter = newFood.name ? true : parseCondition(newFood.calories, food.calories);
        const commentsFilter = newFood.name ? true : (newFood.comments ? food.comments.toLowerCase().includes(newFood.comments.toLowerCase()) : true);
        return nameFilter && typeFilter && carbsFilter && caloriesFilter && commentsFilter;
    });

    const paginatedFoods = filteredFoods.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleAddFood = () => {
        if (newFood.name && newFood.carbs && newFood.calories && newFood.type) {
            const foodExists = items.some(food =>
                food.name.toLowerCase() === newFood.name.toLowerCase() &&
                (!newFood.type || food.type.toLowerCase() === newFood.type.toLowerCase()) &&
                (!newFood.comments || food.comments.toLowerCase() === newFood.comments.toLowerCase()) &&
                (!newFood.carbs || food.carbs === parseFloat(newFood.carbs)) &&
                (!newFood.calories || food.calories === parseFloat(newFood.calories))
            );
            if (!foodExists) {
                dispatch(addFood(newFood));
                setNewFood({ name: newFood.name, carbs: '', calories: '', type: '', comments: '' });
            }
        }
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);  // Reset to the first page
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);

    return (
        <div>
            <div className="add-food-form header">
                <input
                    type="text"
                    placeholder="Name"
                    value={newFood.name}
                    onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Carbs"
                    value={newFood.carbs}
                    onChange={(e) => setNewFood({ ...newFood, carbs: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Calories"
                    value={newFood.calories}
                    onChange={(e) => setNewFood({ ...newFood, calories: e.target.value })}
                />
                <select name="type" value={newFood.type} onChange={(e) => setNewFood({ ...newFood, type: e.target.value })}>
                    <option value="">Any</option>
                    {itemTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Comments"
                    value={newFood.comments}
                    onChange={(e) => setNewFood({ ...newFood, comments: e.target.value })}
                />
                <button onClick={handleAddFood}>Add Food</button>
                <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th onClick={() => handleSort('carbs')}>
                                Carbs {sortConfig.key === 'carbs' && (sortConfig.direction === 'ascending' ? '↑' : sortConfig.direction === 'descending' ? '↓' : '')} (<i>per 100g</i>)
                            </th>
                            <th onClick={() => handleSort('calories')}>
                                Calories {sortConfig.key === 'calories' && (sortConfig.direction === 'ascending' ? '↑' : sortConfig.direction === 'descending' ? '↓' : '')} (<i>per 100g</i>)
                            </th>
                            <th>Type</th>
                            <th>Comments</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedFoods.map(food => (
                            <tr key={food.id}>
                                <td>{food.name}</td>
                                <td>{food.carbs}</td>
                                <td>{food.calories}</td>
                                <td>{food.type}</td>
                                <td>{food.comments}</td>
                                <td>
                                    <button>Edit</button>
                                    <button>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={page === currentPage ? 'active' : ''}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Foods;
