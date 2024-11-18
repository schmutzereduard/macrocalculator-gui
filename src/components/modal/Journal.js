import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactModal from 'react-modal';
import { addJournal, updateJournal, deleteJournal, fetchInsulinTypes } from '../../features/journalsSlice';
import ConfirmDelete from '../modal/ConfirmDelete';
import SaveChanges from '../modal/SaveChanges';
import Loading from '../misc/Loading';
import { fetchFoods } from '../../features/foodsSlice';
import { fetchRecipes } from "../../features/recipesSlice";
import useDynamicModals from "../../hooks/useDynamicModals";

function Journal({ onClose }) {

    const dispatch = useDispatch();
    const { selectedItem: journal, insulinTypes, loading } = useSelector(state => state.journals);
    const { modals, openModal, closeModal } = useDynamicModals();

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
                        <EntriesHeader
                            editingJournal={editingJournal}
                            setEditingJournal={setEditingJournal}
                        />
                        <Entries
                            editingJournal={editingJournal}
                            setEditingJournal={setEditingJournal}
                        />
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

function EntriesHeader({ editingJournal, setEditingJournal }) {

    const { insulinTypes } = useSelector((state) => state.journals);
    const { modals, openModal, closeModal } = useDynamicModals();
    const [ newEntry, setNewEntry ] = useState({
        time: '',
        bloodSugarLevel: '',
        recipes: [],
        foods: [],
        insulinUnits: '',
        insulinType: ''
    });

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
                onClick={openFoodsModal}
            >
                Foods
            </button>
            <button
                onClick={openRecipesModal}
            >
                Recipes
            </button>
            <button
                onClick={handleAddEntry}
                disabled={!entryValid()}
            >
                Add entry
            </button>

            <ReactModal
                isOpen={modals.foodsModal?.isOpen}
                onRequestClose={closeFoodsModal}
            >
                <Foods
                    journalFoods={newEntry.journalFoods}
                    onClose={closeFoodsModal}
                />
            </ReactModal>

            <ReactModal
                isOpen={modals.recipesModal?.isOpen}
                onRequestClose={closeRecipesModal}
            >
                <Recipes
                    journalRecipes={newEntry.journalRecipes}
                    onClose={closeRecipesModal}
                />
            </ReactModal>
        </div>
    );
}

function Entries({ editingJournal, setEditingJournal }) {

    const { modals, openModal, closeModal } = useDynamicModals();

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

    const openFoodsModal = (entry) => {

        openModal("foodsModal", { entry: entry });
    };

    const openRecipesModal = (entry) => {

        openModal("recipesModal", { entry: entry });
    };

    const closeFoodsModal = () => {

        closeModal("foodsModal");
    };

    const closeRecipesModal = () => {

        closeModal("recipesModal");
    };

    const onAddFood = (food) => {

        setEditingJournal((prev) => ({
            ...prev,
            entries: prev.entries.map((entry) => ({
                ...entry,
                journalFoods: [...entry.journalFoods, food]
                }))
        }));
    }

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
                        <th>Intake (Food / Recipes)</th>
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
                                    <p>Carbs: {entry.totalCarbs ? entry.totalCarbs : 0}, Calories: {entry.totalCalories ? entry.totalCalories : 0}</p>
                                    <button onClick={() => openFoodsModal(entry)}>Foods</button>
                                    <button onClick={() => openRecipesModal(entry)}>Recipes</button>
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
                            setEditingJournal={setEditingJournal}
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
                    <ReactModal
                        isOpen={modals.foodsModal?.isOpen}
                        onRequestClose={closeFoodsModal}
                    >
                        <Foods
                            journalFoods={modals.foodsModal?.entry.journalFoods}
                            onAdd={onAddFood}
                            onClose={closeFoodsModal}
                        />
                    </ReactModal>
                    <ReactModal
                        isOpen={modals.recipesModal?.isOpen}
                        onRequestClose={closeRecipesModal}
                    >
                        <Recipes
                            journalRecipes={modals.recipesModal?.entry.journalRecipes}
                            onClose={closeRecipesModal}
                        />
                    </ReactModal>
                </tbody>
            </table>
        </div>
    );
}

function Entry({ entry, setEditingJournal, onClose }) {

    const { insulinTypes } = useSelector((state) => state.journals);
    const { modals, openModal, closeModal } = useDynamicModals();

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
                        journalFoods={entry.journalFoods}
                        onClose={closeFoodsModal}
                    />
                </ReactModal>

                <ReactModal
                    isOpen={modals.recipesModal?.isOpen}
                    onRequestClose={closeRecipesModal}
                >
                    <Recipes
                        journalRecipes={entry.journalRecipes}
                        onClose={closeRecipesModal}
                    />
                </ReactModal>
            </div>
        </div>
    );
}

function Foods({ journalFoods, onAdd, onEdit, onDelete, onClose }) {

    const dispatch = useDispatch();
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

    const getTotalProperties = (journalFoods) => {
        let totalCarbs = 0, totalCalories = 0;
        journalFoods.forEach(food => {
            totalCarbs += food.carbs;
            totalCalories += food.calories;
        });
        return `Carbs: ${totalCarbs}g, Calories: ${totalCalories}`;
    };

    const handleClose = () => {
        onClose();
    };

    const handleEdit = () => {

    };

    const handleDelete = () => {

    };

    const handleAdd = () => {

        const selectedFood = foods.find(food => food.id === Number.parseInt(newFood.food));

        onAdd({
            quantity: newFood.quantity,
            food: selectedFood
        });
        setNewFood({
            quantity: '',
            food: null
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
            && newFood.food !== null;
    };

    return (
        <div>
            <div className="food-list">
                <h3>Foods in this entry</h3>
                {journalFoods && getTotalProperties(journalFoods)}
                <ul>
                    {journalFoods && journalFoods.map((journalFood, index) => (
                        <div style={{display: "flex"}} key={index}>
                            <li>{journalFood.quantity}g of {journalFood.food.name}</li>
                            <button onClick={handleEdit}>Edit</button>
                            <button onClick={handleDelete}>Delete</button>
                        </div>
                    ))}
                </ul>
            </div>
            <br />
            <div className="modal-form">
                <h3>Add a new food to this entry</h3>
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
                    <select name="food" onChange={handleInputChange}>
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
                    <button onClick={handleClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

function Recipes({ journalRecipes, onClose }) {

    const dispatch = useDispatch();
    const {items: recipes } = useSelector((state) => state.recipes);

    useEffect(() => {
        if (recipes.length === 0) {
            dispatch(fetchRecipes());
        }
    }, [dispatch, recipes.length]);

    const getTotalProperties = (journalRecipes) => {
        let totalCarbs = 0, totalCalories = 0;
        journalRecipes.forEach(food => {
            totalCarbs += food.carbs;
            totalCalories += food.calories;
        });
        return `Carbs: ${totalCarbs}g, Calories: ${totalCalories}`;
    };

    const handleSave = () => {
        onClose();
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <div>
            <h3>Recipes in this entry</h3>
            {journalRecipes && getTotalProperties(journalRecipes)}
            <ul>
                {journalRecipes && journalRecipes.map((journalRecipe, index) => (
                    <div style={{ display: "flex" }} key={index}>
                        <li>{journalRecipe.quantity}g of {journalRecipe.recipe.name}</li>
                        <button>Edit</button>
                        <button>Delete</button>
                    </div>
                ))}
            </ul>
            <input placeholder="Enter quantity (g)" /> of
            <select>
                <option>Select Recipe</option>
                {recipes && recipes.map(recipe => (
                    <option value={recipe}>{recipe.name}</option>
                ))}
            </select>
            <button>Add</button>
            <div className="modal-buttons">
                <div>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

export default Journal;