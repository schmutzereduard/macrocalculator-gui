import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactModal from 'react-modal';
import {fetchFoods, fetchFoodTypes, fetchFood, deleteFood, addNewFood} from '../../features/foodsSlice';
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
    const { items: foods, selectedItem: food, loading } = useSelector((state) => state.foods);
    const { modalConfig, setModalConfig } = useModals();
    const { sortConfig, handleSortChange, sort } = useSorting();
    const { pageConfig, handlePageChange, handleItemsPerPageChange, paginate } = usePagination();
    const { searchConfig, search, handleSearchChange } = useSearching();

    useEffect(() => {
        dispatch(fetchFoods());
        dispatch(fetchFoodTypes());
    }, [dispatch]);

    const filteredFoods = search(foods);
    const sortedFoods = sort(filteredFoods);
    const paginatedFoods = paginate(sortedFoods);

    const openFoodModal = () => {

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
            item: {
                id: foodId,
                name: foodName
            }
        });

    };

    const closeDeleteFoodModal = () => {

        setModalConfig({
            ...modalConfig,
            isDeleteItemModalOpen: false,
            item: {
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

        dispatch(addNewFood());
        openFoodModal();
    };

    const handleEdit = (foodId) => {

        dispatch(fetchFood(foodId));
        openFoodModal();
    };

    return (
        <div>
            {loading ? (
                <Loading />
            ) : (
                <div>
                    <FoodsHeader
                        pageConfig={pageConfig}
                        searchConfig={searchConfig}
                        handleAdd={handleAdd}
                        handleItemsPerPageChange={handleItemsPerPageChange}
                        handlePageChange={handlePageChange}
                        handleSearchChange={handleSearchChange}
                    />
                    <FoodsTable
                        foods={paginatedFoods}
                        sortConfig={sortConfig}
                        handlePageChange={handlePageChange}
                        handleSortChange={handleSortChange}
                        onEdit={handleEdit}
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
                            food={food}
                            onClose={closeFoodModal}
                        />
                    </ReactModal>
                    <ReactModal
                        isOpen={modalConfig.isDeleteItemModalOpen}
                        onRequestClose={closeDeleteFoodModal}
                    >
                        <ConfirmDelete
                            name={modalConfig.item.name}
                            onConfirm={() => handleDelete(modalConfig.item.id)}
                            onCancel={closeDeleteFoodModal}
                        />
                    </ReactModal>
                </div>
            )}
        </div>
    );
}

function FoodsHeader({ pageConfig, searchConfig, handleAdd, handleItemsPerPageChange, handlePageChange, handleSearchChange }) {

    return (
        <div className='header'>
            <PerPage
                itemsPerPage={pageConfig.itemsPerPage}
                onChange={handleItemsPerPageChange}
            />
            <SearchFoods
                searchConfig={searchConfig}
                handlePageChange={handlePageChange}
                handleSearchChange={handleSearchChange}
            />
            <button onClick={handleAdd}>Add Food</button>
        </div>
    );
}

function SearchFoods({ searchConfig, handlePageChange, handleSearchChange }) {

    const { itemTypes: foodTypes } = useSelector((state) => state.foods);

    const handleInputChange = (e) => {

        const {name, value} = e.target;
        handleSearchChange({...searchConfig, [name]: value});
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