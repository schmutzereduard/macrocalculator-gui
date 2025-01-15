import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRecipe, updateRecipe } from "../../store/recipesSlice";
import { fetchFoods } from "../../store/foodsSlice";
import ReactModal from "react-modal";
import SaveChanges from "./SaveChanges";
import ConfirmDelete from "./ConfirmDelete";
import Loading from "../misc/Loading";
import PerPage from "../misc/PerPage";
import useFiltering from "../../hooks/useFiltering";
import usePagination from "../../hooks/usePagination";
import useModals from "../../hooks/useModals";
import "./Recipe.css";

function Recipe({ recipe, onClose }) {

    const dispatch = useDispatch();
    const { items: foods } = useSelector((state) => state.foods);
    const { modals, openModal, closeModal } = useModals();
    const [ editingRecipe, setEditingRecipe ] = useState(null);
    const [ alert, setAlert ] = useState("");

    useEffect(() => {
        setEditingRecipe({...recipe});
        dispatch(fetchFoods());
    }, [recipe, dispatch]);

    const recipeValid = () => {
        
        return editingRecipe
            && editingRecipe.name;
    };

    const recipeChanged = () => {

        for (let key in editingRecipe) {
            if (editingRecipe[key] !== recipe[key]) return true;
        }
        return false;
    };

    const onSave = () => {
        
        if (!recipe.id){
            dispatch(addRecipe(editingRecipe));
        } else {
            dispatch(updateRecipe(editingRecipe));
        }
        onClose();
    };

    const onExit = () => {
        
        closeModal("saveChanges");
        onClose();
    };

    const handleSave = () => {

        if (recipeChanged()) {
            onSave();
        } else {
            onClose();
        }
    };

    const handleClose = () => {
        
        if (recipeChanged() && recipeValid()) {
            openModal("saveChanges");
        } else {
            onExit();
        }
    };

    const openDeleteFoodModal = (foodId, foodName) => {

        openModal("deleteFood", { id: foodId, name: foodName });
    };

    const closeDeleteFoodModal = () => {
        
        closeModal("deleteFood");
    };

    const handleDeleteFood = () => {
        
        setEditingRecipe((prev) => ({
            ...prev,
            recipeFoods: prev.recipeFoods.filter((rf) => rf.food.id !== modals.deleteFood?.id),
        }));
        closeModal("deleteFood");
    };

    const handleAddFoods = (foodQuantities) => {
        
        const newRecipeFoods = Object.keys(foodQuantities)
            .map((foodId) => ({
                food: foods.find((f) => f.id === parseInt(foodId)),
                quantity: foodQuantities[foodId],
            }))
            .filter((item) => item.quantity > 0);

        setEditingRecipe({
            ...editingRecipe,
            recipeFoods: [...(editingRecipe.recipeFoods || []), ...newRecipeFoods],
        });
    };

    const getTotalProperties = (recipeFoods) => {
        
        let totalCarbs = 0, totalCalories = 0; // Add other properties as needed
        recipeFoods.forEach(({food, quantity}) => {
            totalCarbs += (food.carbs * quantity) / 100;
            totalCalories += (food.calories * quantity) / 100;
        });
        return `Carbs: ${totalCarbs}g, Calories: ${totalCalories}`;
    };

    const showAlert = () => {

        if (editingRecipe.name === "") {
            setAlert("Please enter a name");
        } else {
            setAlert("");
        }
    }

    return (
        <div>
            {editingRecipe ? (
                <div>
                    <div className="modal-form">
                        <input
                            type="text"
                            name="name"
                            placeholder="Recipe Name"
                            value={editingRecipe.name}
                            onChange={(e) =>
                                setEditingRecipe({...editingRecipe, name: e.target.value})
                            }
                        />
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={editingRecipe.description}
                            onChange={(e) =>
                                setEditingRecipe({...editingRecipe, description: e.target.value})
                            }
                        />
                    </div>
                    
                    <RecipeFoods 
                        editingRecipe={editingRecipe}
                        getTotalProperties={getTotalProperties}
                        onRemove={openDeleteFoodModal}
                    />
                    <AddFoods
                        handleAddFoodsToRecipe={handleAddFoods}
                        getTotalProperties={getTotalProperties}
                    />

                    <div className="modal-buttons">
                        <div>
                            <span
                                onMouseEnter={showAlert}
                                onMouseLeave={() => setAlert("")}
                            ><button
                                onClick={handleSave}
                                disabled={!recipeValid()}
                            >
                                Save
                            </button>
                            </span>
                            <button onClick={handleClose}>Close</button>
                            <div>{alert}</div>
                        </div>
                    </div>

                    <ReactModal
                        isOpen={modals.saveChanges?.isOpen}
                        onRequestClose={onExit}>
                        <SaveChanges
                            onSave={onSave}
                            onExit={onExit}
                        />
                    </ReactModal>

                    <ReactModal
                        isOpen={modals.deleteFood?.isOpen}
                        onRequestClose={closeDeleteFoodModal}>
                        <ConfirmDelete
                            name={`${modals.deleteFood?.name} from ${editingRecipe.name}`}
                            onConfirm={handleDeleteFood}
                            onCancel={closeDeleteFoodModal}
                        />
                    </ReactModal>
                </div>
            ) : (
                <Loading/>
            )}
        </div>
    );
}

function RecipeFoods({ editingRecipe, getTotalProperties, onRemove }) {
    
    return (
        <div>
            <h3>Foods in this Recipe: <span>{getTotalProperties(editingRecipe.recipeFoods)}</span></h3>
            <ul className="list">
                {editingRecipe.recipeFoods.map((rf, index) => (
                    <li key={index} className="list-item">
                        {rf.food.name} - {rf.quantity}g
                        <span>{getTotalProperties([{food: rf.food, quantity: rf.quantity}])}</span>
                        <button onClick={() => onRemove(rf.food.id, rf.food.name)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function AddFoods({ handleAddFoodsToRecipe, getTotalProperties }) {

    const { items: foods } = useSelector((state) => state.foods);
    const { pageConfig, handlePageChange, handleItemsPerPageChange, paginate } = usePagination();
    const { filter, filterConfig, handleFilterChange } = useFiltering({});
    const [ selectedProperty, setSelectedProperty ] = useState("name");
    const [ foodQuantities, setFoodQuantities ] = useState({});

    const handleSelectedPropertyChange = (e) => {

        const { value } = e.target;
        setSelectedProperty(value);
        handleFilterChange({ [value]: "" });
        handlePageChange(1);
    }

    const handleInputChange = (e) => {

        const { value } = e.target;
        handleFilterChange({
            [selectedProperty]: value
        });
        handlePageChange(1);
    };

    const handleQuantityChange = (foodId, quantity) => {

        setFoodQuantities({...foodQuantities, [foodId]: quantity});
    };

    const filteredFoods = filter(foods);
    const paginatedFoods = paginate(filteredFoods);

    const renderPagination = () => {
        const totalPages = Math.ceil(filteredFoods.length / pageConfig.itemsPerPage);
        return (
            <div className="pagination">
                {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={page === pageConfig.currentPage ? "active" : ""}
                    >
                        {page}
                    </button>
                ))}
            </div>
        );
    };

    const addFoodsToRecipe = () => {

        handleAddFoodsToRecipe(foodQuantities);
        setFoodQuantities({});
    }

    return (
        <div>
            <div className="add-foods-header">
                <select onChange={handleSelectedPropertyChange} value={selectedProperty}>
                    <option value="name">Name</option>
                    <option value="type">Type</option>
                    <option value="carbs">Carbs</option>
                    <option value="calories">Calories</option>
                </select>
                <input
                    type="text"
                    placeholder="Search for foods..."
                    value={filterConfig[selectedProperty]}
                    onChange={handleInputChange}
                />

                <PerPage itemsPerPage={pageConfig.itemsPerPage} onChange={handleItemsPerPageChange}/>
            </div>
            <div style={{
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                gap: "10px"

            }}>
                <p>{getTotalProperties(Object.keys(foodQuantities).map(foodId => ({
                    food: foods.find(f => f.id === parseInt(foodId)),
                    quantity: foodQuantities[foodId]
                })))}
                </p>
                <button disabled={Object.keys(foodQuantities).length === 0}
                        onClick={addFoodsToRecipe}>Add
                </button>
            </div>
            <ul className="list">
                {paginatedFoods.map((food) => (
                    <li key={food.id} className="list-item">
                        {food.name}
                        <br/>

                        <div className="food-totals">
                            <span>per 100g: {getTotalProperties([{food, quantity: 100}])}</span>
                            <br/>
                            {foodQuantities[food.id] && (
                                <span>per {foodQuantities[food.id]}g: {getTotalProperties([{food, quantity: foodQuantities[food.id]}])}</span>
                            )}
                        </div>

                        <br/>
                        <input
                            type="number"
                            placeholder="Quantity (g)"
                            value={foodQuantities[food.id] || ""}
                            onChange={(e) =>
                                handleQuantityChange(food.id, e.target.value)
                            }
                        />
                    </li>
                ))}
            </ul>
            <div>{renderPagination()}</div>
        </div>
    );
}

export default Recipe;
