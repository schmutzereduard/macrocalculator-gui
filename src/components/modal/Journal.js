import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addJournal, updateJournal, deleteJournal, fetchInsulinTypes } from '../../features/journalsSlice';
import ReactModal from 'react-modal';
import { fetchFoods } from '../../features/foodsSlice';
import { fetchRecipes } from "../../features/recipesSlice";
import ConfirmDelete from '../modal/ConfirmDelete';
import SaveChanges from '../modal/SaveChanges';
import Loading from '../misc/Loading';
import useModals from "../../hooks/useModals";

const JournalContext = createContext(null);

function Journal({ onClose }) {

    const dispatch = useDispatch();
    const { selectedItem: journal, insulinTypes, loading } = useSelector(state => state.journals);
    const { modals, openModal, closeModal } = useModals();

    const [ editingJournal, setEditingJournal ] = useState(null);

    useEffect(() => {
        if (insulinTypes.length === 0)
            dispatch(fetchInsulinTypes());
    }, [dispatch, insulinTypes]);

    useEffect(() => {
        setEditingJournal({ ...journal });
    }, [journal]);

    const journalChanged = () => {

        for (let key in editingJournal) {
            if (editingJournal[key] !== journal[key]) return true;
        }
        return false;
    };

    const onSave = () => {

        if (!editingJournal.id){
            dispatch(addJournal(editingJournal));
        } else {
            dispatch(updateJournal(editingJournal));
        }
        onClose();
    };

    const onExit = () => {

        closeModal("saveChanges");
        onClose();
    };

    const handleSave = () => {

        if (journalChanged()) {
            onSave();
        } else {
            onClose();
        }
    };

    const handleClose = () => {

        if (journalChanged()) {
            openModal("saveChanges");
        } else {
            onExit();
        }
    };

    const openDeleteJournalModal = () => {

        openModal("deleteJournal", { id: editingJournal.id, name: `journal for ${editingJournal.date}` });
    };

    const closeDeleteJournalModal = () => {

        closeModal("deleteJournal");
    };

    const handleDelete = () => {

        dispatch(deleteJournal(editingJournal.id));
        closeDeleteJournalModal();
        onClose();
    };

    return (
        <div>
            {loading ? (
                <Loading />
            ) : (
                <div>
                    <div className="modal-form">
                        <h2>
                            Journal for {editingJournal ? editingJournal.date : ''}
                            <span><button onClick={openDeleteJournalModal}>Delete</button></span>
                        </h2>
                        <textarea
                            value={editingJournal?.notes || ''}
                            onChange={(e) => {
                                setEditingJournal({
                                    ...editingJournal,
                                    notes: e.target.value
                                });
                            }}
                            rows="4"
                            placeholder="Notes"
                        />
                        <h3>Add a new entry</h3>
                        <JournalContext.Provider
                            value={{
                                editingJournal,
                                setEditingJournal,
                            }}
                        >
                            <EntriesHeader />
                            <Entries />
                        </JournalContext.Provider>
                    </div>

                    <div className="modal-buttons">
                        <div>
                            <button onClick={handleSave}>Save</button>
                            <button onClick={handleClose}>Close</button>
                        </div>
                    </div>

                    <ReactModal
                        isOpen={modals.saveChanges?.isOpen}
                        onRequestClose={onExit}
                    >
                        <SaveChanges
                            onSave={onSave}
                            onExit={onExit}
                        />
                    </ReactModal>

                    <ReactModal
                        isOpen={modals.deleteJournal?.isOpen}
                        onRequestClose={closeDeleteJournalModal}
                    >
                        <ConfirmDelete
                            name={`journal for ${editingJournal?.date}`}
                            onConfirm={handleDelete}
                            onCancel={closeDeleteJournalModal}
                        />
                    </ReactModal>
                </div>
            )}
        </div>
    );
}

function EntriesHeader() {

    const { editingJournal, setEditingJournal } = useContext(JournalContext);
    const { insulinTypes } = useSelector((state) => state.journals);
    const [ newEntry, setNewEntry ] = useState({
        time: '',
        bloodSugarLevel: '',
        recipes: [],
        foods: [],
        insulinUnits: '',
        insulinType: ''
    });

    const entryValid = () => {

        return newEntry.time
            && newEntry.bloodSugarLevel !== ""
            && newEntry.insulinUnits !== ""
            && newEntry.insulinType;
    };

    const handleAddEntry = () => {

        const dateTime = editingJournal.date + "T" + newEntry.time;
        const entryToAdd = {
            ...newEntry,
            time: dateTime,
        };
        setEditingJournal((prev) => ({
            ...prev,
            entries: [...(prev.entries || []), entryToAdd],
        }));
        setNewEntry({ time: '', bloodSugarLevel: '', recipes: [], foods: [], insulinUnits: '', insulinType: '' });
    };

    const handleInputChange = (e) => {

        const { name, value } = e.target;

        setNewEntry((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="header">
            <input
                name="time"
                value={newEntry.time}
                onChange={(e) => handleInputChange(e)}
                type="time"
                placeholder="Time"
            />
            <input
                name="bloodSugarLevel"
                value={newEntry.bloodSugarLevel}
                onChange={(e) => handleInputChange(e)}
                type="number"
                placeholder="Blood Sugar Level"
            />
            <input
                name="insulinUnits"
                value={newEntry.insulinUnits}
                onChange={(e) => handleInputChange(e)}
                type="number"
                placeholder="Insulin Units"
            />
            <select
                name="insulinType"
                value={newEntry.insulinType}
                onChange={(e) => handleInputChange(e)}
            >
                <option value="">Select Insulin Type</option>
                {insulinTypes && insulinTypes.map((type) => (
                    <option key={type} value={type}>
                        {type}
                    </option>
                ))}
            </select>
            <button
                onClick={handleAddEntry}
                disabled={!entryValid()}
            >
                Add entry
            </button>
        </div>
    );
}

function Entries() {

    const { editingJournal, setEditingJournal } = useContext(JournalContext);
    const { modals, openModal, closeModal } = useModals();

    const openDeleteEntryModal = (entryId, entryTime) => {

        openModal("deleteEntry", { id: entryId, name: entryTime});
    };

    const closeDeleteEntryModal = () => {

        closeModal("deleteEntry");
    };

    const handleDelete = () => {

        setEditingJournal((prev) => ({
            ...prev,
            entries: prev.entries.filter((entry) => entry.id !== modals.deleteEntry?.id),
        }));
        closeDeleteEntryModal();
    };

    const openEditEntryModal = (entryId) => {

        openModal("editEntry", { id: entryId });
    };

    const closeEditEntryModal = () => {

        closeModal("editEntry");
    };

    return (
        <div>
            <h3>Entries</h3>
            <table>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Blood Sugar (Level)</th>
                        <th>Insulin (Units)</th>
                        <th>Insulin (Type)</th>
                        <th>Intake (Foods & Recipes)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {editingJournal && editingJournal.entries.map((entry) => {
                        return (
                            <tr key={entry.id}>
                                <td>{new Date(entry.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</td>
                                <td>{entry.bloodSugarLevel}</td>
                                <td>{entry.insulinUnits}</td>
                                <td>{entry.insulinType}</td>
                                <td>
                                    <p>
                                        Carbs: {entry.journalFoods?.reduce((sum, food) => sum + food.carbs, 0) || 0},
                                        Calories: {entry.journalFoods?.reduce((sum, food) => sum + food.calories, 0) || 0}
                                    </p>
                                </td>
                                <td>
                                    <button onClick={() => openEditEntryModal(entry.id)}>Edit</button>
                                    <button onClick={() => openDeleteEntryModal(entry.id, entry.time)}>Delete</button>
                                </td>
                            </tr>
                        )})}
                    <ReactModal
                        isOpen={modals.editEntry?.isOpen}
                        onRequestClose={closeEditEntryModal}
                    >
                        <Entry
                            entry={editingJournal && editingJournal.entries.find((entry) => entry.id === modals.editEntry?.id)}
                            onClose={closeEditEntryModal}
                        />
                    </ReactModal>
                    <ReactModal
                        isOpen={modals.deleteEntry?.isOpen}
                        onRequestClose={closeDeleteEntryModal}
                    >
                        <ConfirmDelete
                            name={`entry for ${modals.deleteEntry?.name}`}
                            onConfirm={handleDelete}
                            onCancel={closeDeleteEntryModal}
                        />
                    </ReactModal>
                </tbody>
            </table>
        </div>
    );
}

function Entry({ entry, onClose }) {

    const { setEditingJournal } = useContext(JournalContext);
    const { insulinTypes } = useSelector((state) => state.journals);
    const { modals, openModal, closeModal } = useModals();

    const openFoodsModal = () => {

        openModal("foodsModal");
    };

    const openRecipesModal = () => {

        openModal("recipesModal");
    };

    const closeFoodsModal = () => {

        closeModal("foodsModal");
    };

    const closeRecipesModal = () => {

        closeModal("recipesModal");
    };

    const handleInputChange = (e) => {

        const { name, value } = e.target;
        setEditingJournal((prev) => ({
            ...prev,
            entries: prev.entries.map((item) =>
                item.id === entry.id ? { ...item, [name]: value } : item
            )
        }));
    };

    return entry && (
        <div>
            <h2>Edit {entry.time}</h2>
            <div className="modal-form">
                <label>
                    Time:
                    <input
                        name="time"
                        value={new Date(entry.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                        onChange={(e) => handleInputChange(e)}
                        type="time"
                        placeholder="Time"
                    />
                </label>
                <label>
                    Blood Sugar:
                    <input
                        name="bloodSugarLevel"
                        value={entry.bloodSugarLevel}
                        onChange={(e) => handleInputChange(e)}
                        type="number"
                        placeholder="Blood Sugar Level"
                    />
                </label>
                <label>
                    Insulin units:
                    <input
                        name="insulinUnits"
                        value={entry.insulinUnits}
                        onChange={(e) => handleInputChange(e)}
                        type="number"
                        placeholder="Insulin Units"
                    />
                </label>
                <label>
                    Insulin type:
                    <select
                        name="insulinType"
                        value={entry.insulinType}
                        onChange={(e) => handleInputChange(e)}
                    >
                        <option value="">Select Insulin Type</option>
                        {insulinTypes && insulinTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Intake:
                    <button
                        onClick={openFoodsModal}
                    >
                        Foods
                    </button>
                    <button
                        onClick={openRecipesModal}
                    >
                        Recipes
                    </button>
                </label>
                <div className="modal-buttons">
                    <div>
                        <button onClick={onClose}>Close</button>
                    </div>
                </div>

                <ReactModal
                    isOpen={modals.foodsModal?.isOpen}
                    onRequestClose={closeFoodsModal}
                >
                    <Foods
                        entry={entry}
                        onClose={closeFoodsModal}
                    />
                </ReactModal>

                <ReactModal
                    isOpen={modals.recipesModal?.isOpen}
                    onRequestClose={closeRecipesModal}
                >
                    <Recipes
                        entry={entry}
                        onClose={closeRecipesModal}
                    />
                </ReactModal>
            </div>
        </div>
    );
}

function Foods({ entry, onClose }) {

    const dispatch = useDispatch();
    const { setEditingJournal } = useContext(JournalContext);
    const { items: foods } = useSelector((state) => state.foods);
    const [ newFood, setNewFood ] = useState({
        quantity: '',
        food: ''
    });

    useEffect(() => {
        if (foods.length === 0) {
            dispatch(fetchFoods());
        }
    }, [dispatch, foods.length]);

    const getTotalProperties = (foods) => {

        let totalCarbs = 0, totalCalories = 0;
        foods.forEach(food => {
            totalCarbs += food.carbs;
            totalCalories += food.calories;
        });
        return `Carbs: ${totalCarbs}g, Calories: ${totalCalories}`;
    };

    const calculateProperties = (food, quantity) => {

        let carbs = food.carbs * (quantity / 100);
        let calories = food.calories * (quantity / 100);

        return { carbs, calories };
    };

    const handleDelete = (food) => {

        setEditingJournal((prev) => {
            const updatedEntries = prev.entries.map((prevEntry) =>
                prevEntry.id === entry.id
                    ? {
                        ...prevEntry,
                        journalFoods: [...(prevEntry.journalFoods.filter((journalFood) => journalFood.id !== food) || [])],
                    }
                    : prevEntry
            );
            return {
                ...prev,
                entries: updatedEntries,
            };
        });
    };

    const handleAdd = () => {

        const selectedFood = foods.find(food => food.id === Number.parseInt(newFood.food));
        const properties = calculateProperties(selectedFood, newFood.quantity);
        const computedFood = {
            ...properties,
            quantity: newFood.quantity,
            food: selectedFood,
        };

        setEditingJournal((prev) => {
            const updatedEntries = prev.entries.map((prevEntry) =>
                prevEntry.id === entry.id
                    ? {
                        ...prevEntry,
                        journalFoods: [...(prevEntry.journalFoods || []), computedFood],
                    }
                    : prevEntry
            );
            return {
                ...prev,
                entries: updatedEntries,
            };
        });

        setNewFood({
            quantity: '',
            food: '',
        });
    };

    const handleInputChange = (e) => {

        const { name, value } = e.target;
        setNewFood({
            ...newFood,
            [name]: value
        });
    };

    const foodValid = () => {

        return !newFood.quantity.startsWith("0")
            && Number.parseInt(newFood.quantity) > 0
            && newFood.food !== '';
    };

    return (
        <div>
            <div className="food-list">
                <h3>Foods in this entry</h3>
                {entry?.journalFoods && getTotalProperties(entry.journalFoods)}
                <ul>
                    {entry?.journalFoods && entry.journalFoods.map((journalFood, index) => (
                        <div style={{display: "flex"}} key={index}>
                            <li>{journalFood.quantity}g of {journalFood.food.name}</li>
                            <button onClick={() => handleDelete(journalFood.id)}>Delete</button>
                        </div>
                    ))}
                </ul>
            </div>
            <br />
            <div className="modal-form">
                <h3>Add a new food to this entry</h3>
                <p>
                    {(() => {
                        if (!foodValid())
                            return 'Enter quantity and select food';

                        const selectedFood = foods.find(food => food.id === Number.parseInt(newFood.food));
                        const properties = calculateProperties(selectedFood, newFood.quantity);
                        return `Carbs: ${properties.carbs}g, Calories: ${properties.calories}`;
                    })()}
                </p>
                <label>
                    Quantity:
                    <input
                        value={newFood.quantity}
                        name="quantity"
                        onChange={handleInputChange}
                        placeholder="Enter quantity (g)"
                        type="number"
                    />
                </label>
                <label>
                    Food:
                    <select
                        name="food"
                        value={newFood.food}
                        onChange={handleInputChange}
                    >
                        <option>Select Food</option>
                        {foods && foods.map(food => (
                            <option
                                key={food.id}
                                name = "food"
                                value={food.id}
                            >
                                {food.name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleAdd}
                        disabled={!foodValid()}
                    >
                        Add
                    </button>
                </label>
            </div>

            <div className="modal-buttons">
                <div>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

function Recipes({ entry, onClose }) {

    const dispatch = useDispatch();
    const { items: recipes } = useSelector((state) => state.recipes);
    const { setEditingJournal } = useContext(JournalContext);
    const [ newRecipe, setNewRecipe ] = useState({
        quantity: '',
        recipe: ''
    });

    useEffect(() => {
        if (recipes.length === 0) {
            dispatch(fetchRecipes());
        }
    }, [dispatch, recipes.length]);

    const getTotalProperties = (journalRecipes) => {
        let totalCarbs = 0, totalCalories = 0;
        journalRecipes.forEach(recipe => {
            totalCarbs += recipe.carbs;
            totalCalories += recipe.calories;
        });
        return `Carbs: ${totalCarbs}g, Calories: ${totalCalories}`;
    };

    const calculateProperties = (recipe, quantity) => {
        let carbs = recipe.totalCarbs * (quantity / 100);
        let calories = recipe.totalCalories * (quantity / 100);
        return { carbs, calories };
    };

    const handleDelete = (recipeId) => {

        setEditingJournal((prev) => {
            const updatedEntries = prev.entries.map((prevEntry) =>
                prevEntry.id === entry.id
                    ? {
                        ...prevEntry,
                        journalRecipes: prevEntry.journalRecipes.filter(
                            (journalRecipe) => journalRecipe.id !== recipeId
                        ),
                    }
                    : prevEntry
            );
            return {
                ...prev,
                entries: updatedEntries,
            };
        });
    };

    const handleAdd = () => {

        const selectedRecipe = recipes.find(recipe => recipe.id === parseInt(newRecipe.recipe));
        const properties = calculateProperties(selectedRecipe, newRecipe.quantity);
        const computedRecipe = {
            ...properties,
            quantity: newRecipe.quantity,
            recipe: selectedRecipe,
        };

        setEditingJournal((prev) => {
            const updatedEntries = prev.entries.map((prevEntry) =>
                prevEntry.id === entry.id
                    ? {
                        ...prevEntry,
                        journalRecipes: [...(prevEntry.journalRecipes || []), computedRecipe],
                    }
                    : prevEntry
            );
            return {
                ...prev,
                entries: updatedEntries,
            };
        });

        setNewRecipe({ quantity: '', recipe: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRecipe((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const recipeValid = () => {
        return !newRecipe.quantity.startsWith('0') &&
            parseInt(newRecipe.quantity) > 0 &&
            newRecipe.recipe !== '';
    };

    return (
        <div>
            <div className="recipes-list">
                <h3>Recipes in this entry</h3>
                {entry?.journalRecipes && getTotalProperties(entry.journalRecipes)}
                <ul>
                    {entry?.journalRecipes && entry.journalRecipes.map((journalRecipe, index) => (
                        <div style={{display: "flex"}} key={index}>
                            <li>{journalRecipe.quantity}g of {journalRecipe.recipe.name}</li>
                            <button onClick={() => handleDelete(journalRecipe.id)}>Delete</button>
                        </div>
                    ))}
                </ul>
            </div>
            <br/>
            <div className="modal-form">
                <h3>Add a new recipe to this entry</h3>
                <p>
                    {(() => {
                        if (!recipeValid())
                            return 'Enter quantity and select recipe';

                        const selectedRecipe = recipes.find(recipe => recipe.id === parseInt(newRecipe.recipe));
                        const properties = calculateProperties(selectedRecipe, newRecipe.quantity);
                        return `Carbs: ${properties.carbs}g, Calories: ${properties.calories}`;
                    })()}
                </p>
                <label>
                    Quantity:
                    <input
                        value={newRecipe.quantity}
                        name="quantity"
                        onChange={handleInputChange}
                        placeholder="Enter quantity (g)"
                        type="number"
                    />
                </label>
                <label>
                    Recipe:
                    <select
                        name="recipe"
                        value={newRecipe.recipe}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Recipe</option>
                        {recipes && recipes.map(recipe => (
                            <option
                                key={recipe.id}
                                value={recipe.id}
                            >
                                {recipe.name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleAdd}
                        disabled={!recipeValid()}
                    >
                        Add
                    </button>
                </label>
            </div>

            <div className="modal-buttons">
                <div>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

export default Journal;