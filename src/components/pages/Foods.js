import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchFoods, fetchFoodTypes} from '../../store/foodsSlice';
import ReactModal from 'react-modal';
import Pagination from '../misc/Pagination';
import PerPage from '../misc/PerPage';
import Loading from '../misc/Loading';
import usePagination from "../../hooks/usePagination";
import useFiltering from "../../hooks/useFiltering";
import useModals from "../../hooks/useModals";
import FoodFilter from "../modal/FoodFilter";
import PlusCard from "../cards/PlusCard";
import FoodCard from "../cards/FoodCard";
import "./Foods.css";

function Foods() {

    const dispatch = useDispatch();
    const {items: foods, loading} = useSelector((state) => state.foods);
    const {modals, modalControls} = useModals();
    const {pageConfig, handlePageChange, handleItemsPerPageChange, paginate} = usePagination();
    const {filterConfig, filter, handleFilterChange} = useFiltering();

    useEffect(() => {
        dispatch(fetchFoods());
        dispatch(fetchFoodTypes());
    }, [dispatch]);

    const filteredFoods = filter(foods);
    const paginatedFoods = paginate(filteredFoods);

    return (loading ? (
                <Loading/>
            ) : (
                <div className={"foods-page"}>
                    <FoodsHeader
                        filterConfig={filterConfig}
                        pageConfig={pageConfig}
                        handleFilterChange={handleFilterChange}
                        handlePageChange={handlePageChange}
                        handleItemsPerPageChange={handleItemsPerPageChange}
                        modalControls={modalControls}
                    />
                    <Pagination
                        currentPage={pageConfig.currentPage}
                        totalPages={Math.ceil(filteredFoods.length / pageConfig.itemsPerPage)}
                        onPageChange={handlePageChange}
                    />
                    <FoodsList foods={paginatedFoods}/>

                    <ReactModal isOpen={modals.filterFoods?.isOpen}>
                        <FoodFilter
                            filterConfig={filterConfig}
                            handleFilterChange={handleFilterChange}
                            handlePageChange={handlePageChange}
                            totalItems={filteredFoods.length}
                            onClose={() => modalControls.closeModal("filterFoods")}
                        />
                    </ReactModal>
                </div>
            )
    );
}

function FoodsHeader({
                         filterConfig,
                         pageConfig,
                         handleFilterChange,
                         handlePageChange,
                         handleItemsPerPageChange,
                         modalControls
                     }) {

    const handleSearch = (e) => {

        const {name, value} = e.target;
        handleFilterChange({...filterConfig, [name]: value});
        handlePageChange(1);
    };

    return (
        <div className="foods-header">
            <PerPage
                itemsPerPage={pageConfig.itemsPerPage}
                onChange={handleItemsPerPageChange}
            />
            <input
                className="search-bar"
                type="text"
                placeholder="Search a food by name..."
                name="name"
                value={filterConfig.name || ""}
                onChange={handleSearch}
            />
            <button
                onClick={() => modalControls.openModal("filterFoods")}
                className="filter-button"
            >
                Filter
            </button>
        </div>
    );
}
function FoodsList({foods}) {

    const [adding, setAdding] = useState(false);

    return (
        <div className="food-list">
            {!adding ? (
                <PlusCard onClick={() => setAdding(true)} />
            ) : (
                <FoodCard
                    food={{
                        id: null,
                        name: "",
                        type: null,
                        carbs: 0,
                        calories: 0,
                    }}
                    onCancel={() => setAdding(false)} // Pass the cancel handler
                />
            )}
            {foods.map((food) => (
                <FoodCard
                    key={food.id}
                    food={food}
                    onCancel={null}
                />
            ))}
        </div>
    );
}

export default Foods;