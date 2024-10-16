import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactModal from 'react-modal';
import { fetchFoods, fetchFoodTypes, fetchFood, addFood, deleteFood } from '../../features/foodsSlice';
import Food from '../modal/Food';

function Foods() {
    const dispatch = useDispatch();
    const { items, itemTypes, loading } = useSelector((state) => state.foods);

    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchFilters, setSearchFilters] = useState({});

    const [isFoodModalOpen, setFoodModalOpen] = useState(false);
    const [isDeleteFoodModalOpen, setDeleteFoodModalOpen] = useState(false);
    const [foodToDelete, setFoodToDelete] = useState({ id: null, name: '' });

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

    const parseCondition = (condition, value) => {
        if (!condition) return true;
        if (condition.startsWith('>=')) return value >= parseFloat(condition.substring(2));
        if (condition.startsWith('>')) return value > parseFloat(condition.substring(1));
        if (condition.startsWith('<=')) return value <= parseFloat(condition.substring(2));
        if (condition.startsWith('<')) return value < parseFloat(condition.substring(1));
        return value === parseFloat(condition);
    };

    const applyFilters = (food) => {
        const { name, type, carbs, calories, comments } = searchFilters;
        const nameFilter = name ? food.name.toLowerCase().includes(name.toLowerCase()) : true;
        const typeFilter = type ? food.type.toLowerCase() === type.toLowerCase() : true;
        const carbsFilter = carbs ? parseCondition(carbs, food.carbs) : true;
        const caloriesFilter = calories ? parseCondition(calories, food.calories) : true;
        const commentsFilter = comments ? food.comments.toLowerCase().includes(comments.toLowerCase()) : true;
        return nameFilter && typeFilter && carbsFilter && caloriesFilter && commentsFilter;
    };

    const filteredFoods = items.filter(applyFilters);

    const sortedFoods = [...filteredFoods].sort((a, b) => {
        if (sortConfig.key) {
            if (sortConfig.direction === 'ascending') {
                return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
            } else if (sortConfig.direction === 'descending') {
                return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
            }
        }
        return 0;
    });

    const paginatedFoods = sortedFoods.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(sortedFoods.length / itemsPerPage);

    const handleSearch = (filters) => {
        setSearchFilters(filters);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to the first page
    };

    const openFoodModal = (foodId) => {
        dispatch(fetchFood(foodId));
        setFoodModalOpen(true);
    };

    const closeFoodModal = () => {
        setFoodModalOpen(false);
    };

    const openDeleteFoodModal = (foodId, foodName) => {
        setFoodToDelete({ id: foodId, name: foodName });
        setDeleteFoodModalOpen(true);
    };

    const closeDeleteFoodModal = () => {
        setDeleteFoodModalOpen(false);
    };

    const handleDelete = (id) => {
        dispatch(deleteFood(id));
        setDeleteFoodModalOpen(false);
    }

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <div className='header'>
                        <select className="per-page" value={itemsPerPage} onChange={handleItemsPerPageChange}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                        <AddFood items={items} itemTypes={itemTypes} onSearch={handleSearch} />
                    </div>
                    <FoodsTable
                        foods={paginatedFoods}
                        sortConfig={sortConfig}
                        handleSort={handleSort}
                        onEdit={openFoodModal}
                        onDelete={openDeleteFoodModal}
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                    <ReactModal isOpen={isFoodModalOpen} onRequestClose={closeFoodModal}>
                        <Food onClose={closeFoodModal} />
                    </ReactModal>
                    <ReactModal isOpen={isDeleteFoodModalOpen} onRequestClose={closeDeleteFoodModal}>
                        <DeleteFood
                            name={foodToDelete.name}
                            onConfirm={() => handleDelete(foodToDelete.id)}
                            onCancel={closeDeleteFoodModal}
                        />
                    </ReactModal>
                </div>
            )}
        </div>
    );
}

function AddFood({ items, itemTypes, onSearch }) {
    const dispatch = useDispatch();
    const [newFood, setNewFood] = useState({
        name: '',
        carbs: '',
        calories: '',
        type: '',
        comments: ''
    });

    const handleAddFood = () => {
        if (newFood.name && newFood.carbs && newFood.calories && newFood.type) {
            const foodExists = items.some(
                (food) =>
                    food.name.toLowerCase() === newFood.name.toLowerCase() &&
                    food.type.toLowerCase() === newFood.type.toLowerCase()
            );
            if (!foodExists) {
                dispatch(addFood(newFood));
                setNewFood({ name: '', carbs: '', calories: '', type: '', comments: '' });
            }
        }
    };

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setNewFood((prevState) => ({ ...prevState, [name]: value }));
        onSearch({ ...newFood, [name]: value });
    };

    return (
        <div className="add-food-form">
            <input
                type="text"
                placeholder="Name"
                name="name"
                value={newFood.name}
                onChange={handleSearchChange}
            />
            <input
                type="text"
                placeholder="Carbs"
                name="carbs"
                value={newFood.carbs}
                onChange={handleSearchChange}
            />
            <input
                type="text"
                placeholder="Calories"
                name="calories"
                value={newFood.calories}
                onChange={handleSearchChange}
            />
            <select
                name="type"
                value={newFood.type}
                onChange={handleSearchChange}
            >
                <option value="">Any</option>
                {itemTypes.map((type) => (
                    <option key={type} value={type}>
                        {type}
                    </option>
                ))}
            </select>
            <input
                type="text"
                placeholder="Comments"
                name="comments"
                value={newFood.comments}
                onChange={handleSearchChange}
            />
            <button onClick={handleAddFood}>Add Food</button>
        </div>
    );
}

function FoodsTable({ foods, sortConfig, handleSort, onEdit, onDelete }) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th onClick={() => handleSort('carbs')}>
                        Carbs {sortConfig.key === 'carbs' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('calories')}>
                        Calories {sortConfig.key === 'calories' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th>Type</th>
                    <th>Comments</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {foods.map((food) => (
                    <tr key={food.id}>
                        <td>{food.name}</td>
                        <td>{food.carbs}</td>
                        <td>{food.calories}</td>
                        <td>{food.type}</td>
                        <td>{food.comments}</td>
                        <td>
                            <button onClick={() => onEdit(food.id)}>Edit</button>
                            <button onClick={() => onDelete(food.id, food.name)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
        <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={page === currentPage ? 'active' : ''}
                >
                    {page}
                </button>
            ))}
        </div>
    );
}

function DeleteFood({ name, onConfirm, onCancel }) {

    return (
        <div>
            <h2>Delete food</h2>
            <p>Do you want to delete {name} ? </p>
            <div className="modal-buttons">
                <button onClick={onConfirm}>Confirm</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
}

export default Foods;
