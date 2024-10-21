import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateRecipe } from "../../features/recipesSlice";
import { fetchFoods } from "../../features/foodsSlice";
import ReactModal from "react-modal";
import SaveChanges from "./SaveChanges";
import ConfirmDelete from "./ConfirmDelete";
import Loading from "../misc/Loading";
import PerPage from "../misc/PerPage";

function Recipe({ onClose }) {
    const dispatch = useDispatch();
    const { selectedItem: recipe } = useSelector((state) => state.recipes);
    const { items: foods } = useSelector((state) => state.foods);

    const [editingRecipe, setEditingRecipe] = useState(null);
    const [foodQuantities, setFoodQuantities] = useState({});
    const [search, setSearch] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setModalOpen] = useState(false);
    const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);
    const [foodToRemove, setFoodToRemove] = useState(null);

    useEffect(() => {
        if (recipe) {
            setEditingRecipe({ ...recipe });
        }
        dispatch(fetchFoods());
    }, [recipe, dispatch]);

    const recipeChanged = () => {
        for (let key in editingRecipe) {
            if (editingRecipe[key] !== recipe[key]) return true;
        }
        return false;
    };

    const onSave = () => {
        dispatch(updateRecipe(editingRecipe));
        onClose();
    };

    const onExit = () => {
        setModalOpen(false);
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
        if (recipeChanged()) {
            setModalOpen(true);
        } else {
            onExit();
        }
    };

    const handleRemoveFood = (foodId) => {
        setFoodToRemove(foodId);
        setShowRemoveConfirmModal(true);
    };

    const confirmRemoveFood = () => {
        setEditingRecipe((prev) => ({
            ...prev,
            recipeFoods: prev.recipeFoods.filter((rf) => rf.food.id !== foodToRemove),
        }));
        setShowRemoveConfirmModal(false);
        setFoodToRemove(null);
    };

    const handleQuantityChange = (foodId, quantity) => {
        setFoodQuantities({ ...foodQuantities, [foodId]: quantity });
    };

    const getFilteredFoods = () => {
        return foods.filter(
            (food) =>
                food.name.toLowerCase().includes(search.toLowerCase()) ||
                food.type.toLowerCase().includes(search.toLowerCase())
        );
    };

    const getPaginatedFoods = () => {
        const filteredFoods = getFilteredFoods();
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredFoods.slice(startIndex, startIndex + itemsPerPage);
    };

    const handleAddFoodsToRecipe = () => {
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
        setFoodQuantities({});
    };

    const renderPagination = () => {
        const filteredFoods = getFilteredFoods();
        const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);
        return (
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={page === currentPage ? "active" : ""}
                    >
                        {page}
                    </button>
                ))}
            </div>
        );
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to the first page
    };

    const getTotalProperties = (recipeFoods) => {
        let totalCarbs = 0, totalCalories = 0; // Add other properties as needed
        recipeFoods.forEach(({ food, quantity }) => {
            totalCarbs += (food.carbs * quantity) / 100;
            totalCalories += (food.calories * quantity) / 100;
        });
        return `Carbs: ${totalCarbs}g, Calories: ${totalCalories}`;
    };

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
                                setEditingRecipe({ ...editingRecipe, name: e.target.value })
                            }
                        />
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={editingRecipe.description}
                            onChange={(e) =>
                                setEditingRecipe({ ...editingRecipe, description: e.target.value })
                            }
                        />
                    </div>
                    <div>
                        <h3>Foods in this Recipe: <span>{getTotalProperties(editingRecipe.recipeFoods)}</span></h3>
                        <ul className="list">
                            {editingRecipe.recipeFoods.map((rf, index) => (
                                <li key={index} className="list-item">
                                    {rf.food.name} - {rf.quantity}g
                                    <span>{getTotalProperties([{ food: rf.food, quantity: rf.quantity }])}</span>
                                    <button onClick={() => handleRemoveFood(rf.food.id)}>Remove</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <div className="add-foods-header">
                            <input
                                type="text"
                                placeholder="Search for foods..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <div>
                                <p>{getTotalProperties(Object.keys(foodQuantities).map(foodId => ({
                                    food: foods.find(f => f.id === parseInt(foodId)),
                                    quantity: foodQuantities[foodId]
                                })))} <span><button disabled={Object.keys(foodQuantities).length === 0} onClick={handleAddFoodsToRecipe}>+</button></span>
                                </p>
                            </div>
                            <PerPage itemsPerPage={itemsPerPage} onChange={handleItemsPerPageChange} />
                        </div>
                        <ul className="list">
                            {getPaginatedFoods().map((food) => (
                                <li key={food.id} className="list-item">
                                    {food.name}
                                    <br />
                                    {foodQuantities[food.id] && (
                                        <div className="food-totals">
                                            ({getTotalProperties([{ food, quantity: foodQuantities[food.id] }])})
                                        </div>
                                    )}
                                    <br />
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
                    </div>
                    <div className="modal-buttons">
                        <div>
                            <button onClick={handleSave}>Save</button>
                            <button onClick={handleClose}>Close</button>
                        </div>
                        <div>{renderPagination()}</div>
                    </div>

                    <ReactModal isOpen={isModalOpen} onRequestClose={() => setModalOpen(false)}>
                        <SaveChanges onSave={onSave} onExit={onExit} />
                    </ReactModal>

                    <ReactModal isOpen={showRemoveConfirmModal} onRequestClose={() => setShowRemoveConfirmModal(false)}>
                        <ConfirmDelete
                            name={"this food from the recipe"}
                            onConfirm={confirmRemoveFood}
                            onCancel={() => setShowRemoveConfirmModal(false)}
                        />
                    </ReactModal>
                </div>
            ) : (
                <Loading />
            )}
        </div>
    );
}

export default Recipe;
