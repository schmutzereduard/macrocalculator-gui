    import React, { useEffect } from 'react';
    import { useDispatch, useSelector } from 'react-redux';
    import { fetchFoods, fetchFoodTypes } from '../../store/foodsSlice';
    import ReactModal from 'react-modal';
    import Pagination from '../misc/Pagination';
    import PerPage from '../misc/PerPage';
    import Loading from '../misc/Loading';
    import usePagination from "../../hooks/usePagination";
    import useSearching from "../../hooks/useSearching";
    import useModals from "../../hooks/useModals";
    import FoodCard from "../cards/FoodCard";
    import FoodFilter from "../modal/FoodFilter";
    import "./Foods.css";

    function Foods() {

        const dispatch = useDispatch();
        const { items: foods, loading } = useSelector((state) => state.foods);
        const { modals, openModal, closeModal } = useModals();
        const { pageConfig, handlePageChange, handleItemsPerPageChange, paginate } = usePagination();
        const { searchConfig, search, handleSearchChange } = useSearching();

        useEffect(() => {
            dispatch(fetchFoods());
            dispatch(fetchFoodTypes());
        }, [dispatch]);

        const filteredFoods = search(foods);
        const paginatedFoods = paginate(filteredFoods);

        return (
            <div>
                {loading ? (
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
                        />

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

    function FoodsList({ foods, handleEdit}) {

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