import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactModal from 'react-modal';
import { fetchFoods, fetchFoodTypes, fetchFood, addFood, deleteFood } from '../../features/foodsSlice';
import Food from '../modal/Food';
import ConfirmDelete from '../modal/ConfirmDelete';
import Pagination from '../misc/Pagination';
import PerPage from '../misc/PerPage';
import Loading from '../misc/Loading';
import useSorting from "../../hooks/useSorting";
import usePagination from "../../hooks/usePagination";
import useSearching from "../../hooks/useSearching";
import useModals from "../../hooks/useModals";

function Foods() {
    const dispatch = useDispatch();
    const { items: foods, loading } = useSelector((state) => state.foods);
    const { modalConfig, setModalConfig } = useModals();
    const { sortConfig, handleSortChange, sort } = useSorting();
    const { pageConfig, handlePageChange, handleItemsPerPageChange, paginate } = usePagination();
    const { searchConfig, search, handleSearchChange } = useSearching({
        name: '',
        type: '',
        carbs: '',
        calories: '',
        comments: ''
    });

    useEffect(() => {
        dispatch(fetchFoods());
        dispatch(fetchFoodTypes());
    }, [dispatch]);

    const filteredFoods = search(foods);
    const sortedFoods = sort(filteredFoods);
    const paginatedFoods = paginate(sortedFoods);

    const openFoodModal = (foodId) => {
        dispatch(fetchFood(foodId));
        setModalConfig({
            ...modalConfig,
            isItemModalOpen: true
        });
    };

    const closeFoodModal = () => {
        setModalConfig({
            ...modalConfig,
            isItemModalOpen: false
        });
    };

    const openDeleteFoodModal = (foodId, foodName) => {
        setModalConfig({
            ...modalConfig,
            isDeleteItemModalOpen: true,
            itemToDelete: {
                id: foodId,
                name: foodName
            }
        });

    };

    const closeDeleteFoodModal = () => {
        setModalConfig({
            ...modalConfig,
            isDeleteItemModalOpen: false,
            itemToDelete: {
                id: null,
                name: null
            }
        });
    };

    const handleDelete = (id) => {
        dispatch(deleteFood(id));
        closeDeleteFoodModal();
    };

    const handleAdd = () => {
        const isFormValid = searchConfig.name && searchConfig.carbs && searchConfig.calories && searchConfig.type;
        if (isFormValid) {
            const foodExists = foods.some(
                (food) =>
                    food.name.toLowerCase() === searchConfig.name.toLowerCase() &&
                    food.type.toLowerCase() === searchConfig.type.toLowerCase()
            );
            if (!foodExists) {
                dispatch(addFood({...searchConfig}));
                handleSearchChange({ name: searchConfig.name, type: '', carbs: '', calories: '', comments: '' });
            }
        }
    };

    return (
        <div>
            {loading ? (
                <Loading />
            ) : (
                <div>
                    <div className='header'>
                        <PerPage
                            itemsPerPage={pageConfig.itemsPerPage}
                            onChange={handleItemsPerPageChange}
                        />
                        <AddFood
                            searchConfig={searchConfig}
                            handlePageChange={handlePageChange}
                            handleSearchChange={handleSearchChange}
                            onAddFood={handleAdd}
                        />
                    </div>
                    <FoodsTable
                        foods={paginatedFoods}
                        sortConfig={sortConfig}
                        handlePageChange={handlePageChange}
                        handleSortChange={handleSortChange}
                        onEdit={openFoodModal}
                        onDelete={openDeleteFoodModal}
                    />
                    <Pagination
                        currentPage={pageConfig.currentPage}
                        totalPages={Math.ceil(sortedFoods.length / pageConfig.itemsPerPage)}
                        onPageChange={handlePageChange}
                    />
                    <ReactModal
                        isOpen={modalConfig.isItemModalOpen}
                        onRequestClose={closeFoodModal}
                    >
                        <Food
                            onClose={closeFoodModal}
                        />
                    </ReactModal>
                    <ReactModal
                        isOpen={modalConfig.isDeleteItemModalOpen}
                        onRequestClose={closeDeleteFoodModal}
                    >
                        <ConfirmDelete
                            name={modalConfig.itemToDelete.name}
                            onConfirm={() => handleDelete(modalConfig.itemToDelete.id)}
                            onCancel={closeDeleteFoodModal}
                        />
                    </ReactModal>
                </div>
            )}
        </div>
    );
}

function AddFood({ searchConfig, handlePageChange, handleSearchChange, onAddFood }) {

    const { itemTypes: foodTypes } = useSelector((state) => state.foods);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        handleSearchChange({ [name]: value });
        handlePageChange(1);
    };

    return (
        <div className="add-food-form">
            <input
                type="text"
                placeholder="Name"
                name="name"
                value={searchConfig.name}
                onChange={handleInputChange}
            />
            <input
                type="text"
                placeholder="Carbs"
                name="carbs"
                value={searchConfig.carbs}
                onChange={handleInputChange}
            />
            <input
                type="text"
                placeholder="Calories"
                name="calories"
                value={searchConfig.calories}
                onChange={handleInputChange}
            />
            <select
                name="type"
                value={searchConfig.type}
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
                value={searchConfig.comments}
                onChange={handleInputChange}
            />
            <button onClick={onAddFood}>+</button>
        </div>
    );
}

function FoodsTable({ foods, sortConfig, handlePageChange, handleSortChange, onEdit, onDelete }) {

    const handleHeaderClick = (value) => {
        handleSortChange(value);
        handlePageChange(1);
    };

    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th onClick={() => handleHeaderClick('carbs')}>
                        Carbs {sortConfig.key === 'carbs' ? sortConfig.icon : ''}
                    </th>
                    <th onClick={() => handleHeaderClick('calories')}>
                        Calories {sortConfig.key === 'calories' ? sortConfig.icon : ''}
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