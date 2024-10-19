import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactModal from 'react-modal';
import { fetchFoods, fetchFoodTypes, fetchFood, addFood, deleteFood } from '../../features/foodsSlice';
import Food from '../modal/Food';
import ConfirmDelete from '../modal/ConfirmDelete';
import Pagination from '../misc/Pagination';
import PerPage from '../misc/PerPage';
import Loading from '../misc/Loading';

function Foods() {
    const dispatch = useDispatch();
    const { items: foods, itemTypes: foodTypes, loading } = useSelector((state) => state.foods);

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

    const filteredFoods = foods.filter(applyFilters);

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
                <Loading />
            ) : (
                <div>
                    <div className='header'>
                        <PerPage itemsPerPage={itemsPerPage} onChange={handleItemsPerPageChange} />
                        <AddFood foods={foods} foodTypes={foodTypes} onSearch={handleSearch} />
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
                        <ConfirmDelete
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

function AddFood({ foods, foodTypes, onSearch }) {
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
            const foodExists = foods.some(
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
                {foodTypes.map((type) => (
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

export default Foods;