    import React, { useEffect } from 'react';
    import { useDispatch, useSelector } from 'react-redux';
    import { fetchFoods, fetchFoodTypes, fetchFood, deleteFood, addNewFood } from '../../store/foodsSlice';
    import ReactModal from 'react-modal';
    import Food from '../modal/Food';
    import ConfirmDelete from '../modal/ConfirmDelete';
    import Pagination from '../misc/Pagination';
    import PerPage from '../misc/PerPage';
    import Loading from '../misc/Loading';
    import useSorting from "../../hooks/useSorting";
    import usePagination from "../../hooks/usePagination";
    import useSearching from "../../hooks/useSearching";
    import useModals from "../../hooks/useModals";
    import FoodCard from "../model/FoodCard";
    import FoodFilter from "../modal/FoodFilter";
    import "./Foods.css";

    function Foods() {

        const dispatch = useDispatch();
        const { items: foods, selectedItem: food, loading: foodsLoading } = useSelector((state) => state.foods);
        const { modals, openModal, closeModal } = useModals();
        const { pageConfig, handlePageChange, handleItemsPerPageChange, paginate } = usePagination();
        const { searchConfig, search, handleSearchChange } = useSearching();

        useEffect(() => {
            dispatch(fetchFoods());
            dispatch(fetchFoodTypes());
        }, [dispatch]);

        const filteredFoods = search(foods);
        const paginatedFoods = paginate(filteredFoods);

        const openDeleteFoodModal = (foodId, foodName) => {

            openModal("deleteFood", { id: foodId, name: foodName });
        };


        const handleDelete = (id) => {

            dispatch(deleteFood(id));
            closeModal("deleteFood");
        };

        const handleAdd = () => {

            dispatch(addNewFood());
            openModal("editFood");
        };

        const handleEdit = (foodId) => {

            dispatch(fetchFood(foodId));
            openModal("editFood");
        };

        return (
            <div>
                {foodsLoading ? (
                    <Loading />
                ) : (
                    <div>
                        <FoodsHeader
                            searchConfig={searchConfig}
                            pageConfig={pageConfig}
                            handleSearchChange={handleSearchChange}
                            handlePageChange={handlePageChange}
                            handleItemsPerPageChange={handleItemsPerPageChange}
                            openModal={openModal}
                        />
                        <Pagination
                            currentPage={pageConfig.currentPage}
                            totalPages={Math.ceil(filteredFoods.length / pageConfig.itemsPerPage)}
                            onPageChange={handlePageChange}
                        />
                        <FoodsList
                            foods={paginatedFoods}
                            handleEdit={handleEdit}
                        />
                        <ReactModal
                            isOpen={modals.editFood?.isOpen}
                            onRequestClose={() => closeModal("editFood")}
                        >
                            <Food
                                food={food}
                                onClose={() => closeModal("editFood")}
                            />
                        </ReactModal>
                        <ReactModal
                            isOpen={modals.deleteFood?.isOpen}
                            onRequestClose={() => closeModal("deleteFood")}
                        >
                            <ConfirmDelete
                                name={modals.deleteFood?.name}
                                onConfirm={() => handleDelete(modals.deleteFood?.id)}
                                onCancel={() => closeModal("deleteFood")}
                            />
                        </ReactModal>

                        <ReactModal
                            isOpen={modals.filterFood?.isOpen}
                            onRequestClose={() => closeModal("filterFood")}
                        >
                            <FoodFilter
                                searchConfig={searchConfig}
                                handleSearchChange={handleSearchChange}
                                handlePageChange={handlePageChange}
                                totalItems={filteredFoods.length}
                            />
                        </ReactModal>
                    </div>
                )}
            </div>
        );
    }

    function FoodsHeader({ searchConfig, pageConfig, handleSearchChange, handlePageChange, handleItemsPerPageChange, openModal }) {

        return(
            <div className="foods-header">
                <PerPage
                    itemsPerPage={pageConfig.itemsPerPage}
                    onChange={handleItemsPerPageChange}
                />
                <SearchBar
                    searchConfig={searchConfig}
                    handleSearchChange={handleSearchChange}
                    handlePageChange={handlePageChange}
                />
                <FilterButton openFilterModal={() => openModal("filterFood")} />
            </div>
        );
    }

    function SearchBar({ searchConfig, handleSearchChange, handlePageChange }) {

        const handleInputChange = (e) => {

            const { name, value } = e.target;
            handleSearchChange({ ...searchConfig, [name]: value });
            handlePageChange(1);
        };

        return (
            <input
                className="search-bar"
                type="text"
                placeholder="Search a food by name..."
                name="name"
                value={searchConfig.name || ""}
                onChange={handleInputChange}
            />
        );
    }

    function FilterButton({ openFilterModal }) {

        return (
            <div>
                <button
                    onClick={openFilterModal}
                    className="filter-button"
                >
                Filter
                </button>
            </div>
        );
    }

    function FoodsList({ foods, handleEdit }) {

        return (
            <div className="food-list">
                {foods.map((food) => (
                    <FoodCard
                        key={food.id}
                        food={food}
                        onClick={() => handleEdit(food.id)}
                    />
                ))}
            </div>
        );
    }

    export default Foods;