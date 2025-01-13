import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchFoods, fetchFoodTypes} from '../../store/foodsSlice';
import ReactModal from 'react-modal';
import Pagination from '../misc/Pagination';
import PerPage from '../misc/PerPage';
import Loading from '../misc/Loading';
import usePagination from "../../hooks/usePagination";
import useSearching from "../../hooks/useSearching";
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
    const {searchConfig, search, handleSearchChange} = useSearching();

    useEffect(() => {
        dispatch(fetchFoods());
        dispatch(fetchFoodTypes());
    }, [dispatch]);

    const filteredFoods = search(foods);
    const paginatedFoods = paginate(filteredFoods);

    return (loading ? (<Loading/>)
            :
            (
                <div className={"foods-page"}>
                    <FoodsHeader
                        searchConfig={searchConfig}
                        pageConfig={pageConfig}
                        handleSearchChange={handleSearchChange}
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

                    <ReactModal isOpen={modals.filterFood?.isOpen}>
                        <FoodFilter
                            searchConfig={searchConfig}
                            handleSearchChange={handleSearchChange}
                            handlePageChange={handlePageChange}
                            totalItems={filteredFoods.length}
                            onClose={() => modalControls.closeModal("filterFood")}
                        />
                    </ReactModal>
                </div>
            )
    );
}

function FoodsHeader({
                         searchConfig,
                         pageConfig,
                         handleSearchChange,
                         handlePageChange,
                         handleItemsPerPageChange,
                         modalControls
                     }) {

    return (
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
            <FilterButton onClick={() => modalControls.openModal("filterFood")}/>
        </div>
    );
}

function SearchBar({searchConfig, handleSearchChange, handlePageChange}) {

    const handleInputChange = (e) => {

        const {name, value} = e.target;
        handleSearchChange({...searchConfig, [name]: value});
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

function FilterButton({onClick}) {

    return (
        <div>
            <button
                onClick={onClick}
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