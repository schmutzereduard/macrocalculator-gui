import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactModal from 'react-modal';
import { addJournal, updateJournal, deleteJournal, fetchInsulinTypes } from '../../features/journalsSlice';
import ConfirmDelete from '../modal/ConfirmDelete';
import SaveChanges from '../modal/SaveChanges';
import Loading from '../misc/Loading';
import { fetchFoods } from '../../features/foodsSlice';
import useModals from "../../hooks/useModals";
import {fetchRecipes} from "../../features/recipesSlice";

function Journal({ onClose }) {

    const dispatch = useDispatch();
    const { selectedItem: journal, insulinTypes, loading } = useSelector(state => state.journals);
    const { modalConfig, setModalConfig } = useModals();

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

        setModalConfig({
            ...modalConfig,
            isSaveItemModalOpen: false,
            item: {
                id: null,
                name: null
            }
        })
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
            setModalConfig({
                ...modalConfig,
                isSaveItemModalOpen: true,
                item: {
                    id: null,
                    name: null
                }
            });
        } else {
            onExit();
        }
    };

    const openDeleteJournalModal = () => {

        setModalConfig({
            ...modalConfig,
            isDeleteItemModalOpen: true,
            item: {
                id: editingJournal.id,
                name: `journal for ${editingJournal.date}`
            }
        });
    };

    const closeDeleteJournalModal = () => {

        setModalConfig({
            ...modalConfig,
            isDeleteItemModalOpen: false,
            item: {
                id: null,
                name: null
            }
        });
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
                        isOpen={modalConfig.isSaveItemModalOpen}
                        onRequestClose={onExit}
                    >
                        <SaveChanges
                            onSave={onSave}
                            onExit={onExit}
                        />
                    </ReactModal>

                    <ReactModal
                        isOpen={modalConfig.isDeleteItemModalOpen}
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
    const { modalConfig: foodsModalConfig, setModalConfig: setFoodsModalConfig } = useModals();
    const { modalConfig: recipesModalConfig, setModalConfig: setRecipesModalConfig } = useModals();
    const [ newEntry, setNewEntry ] = useState({
        time: '',
        bloodSugarLevel: '',
        recipes: [],
        foods: [],
        insulinUnits: '',
        insulinType: ''
    });

    const openFoodsModal = () => {

        setFoodsModalConfig({
            ...foodsModalConfig,
            isItemModalOpen: true
        });
    };

    const openRecipesModal = () => {

        setRecipesModalConfig({
            ...recipesModalConfig,
            isItemModalOpen: true
        });
    };

    const closeFoodsModal = () => {

        setFoodsModalConfig({
            ...foodsModalConfig,
            isItemModalOpen: false
        });
    };

    const closeRecipesModal = () => {

        setRecipesModalConfig({
            ...recipesModalConfig,
            isItemModalOpen: false
        });
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
                isOpen={foodsModalConfig.isItemModalOpen}
                onRequestClose={closeFoodsModal}
            >
                <Foods
                    journalFoods={newEntry.journalFoods}
                    onClose={closeFoodsModal}
                />
            </ReactModal>

            <ReactModal
                isOpen={recipesModalConfig.isItemModalOpen}
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

    const { modalConfig, setModalConfig } = useModals();
    const [ entryConfig, setEntryConfig ] = useState({
        isFoodsModalOpen: false,
        isRecipesModalOpen: false
    });

    const openDeleteEntryModal = (entryId, entryTime) => {

        setModalConfig({
            ...modalConfig,
            isDeleteItemModalOpen: true,
            item: {
                id: entryId,
                name: entryTime
            }
        });
    };

    const closeDeleteEntryModal = () => {

        setModalConfig({
            ...modalConfig,
            isDeleteItemModalOpen: false,
            item: {
                id: null,
                name: null
            }
        });
    };

    const handleDelete = () => {

        setEditingJournal((prev) => ({
            ...prev,
            entries: prev.entries.filter((entry) => entry.id !== modalConfig.item.id),
        }));
        closeDeleteEntryModal();
    };

    const openEditEntryModal = (entryId) => {

        setModalConfig({
           ...modalConfig,
           isItemModalOpen: true,
           item: {
               id: entryId
           }
        });
    };

    const closeEditEntryModal = () => {

        setModalConfig({
            ...modalConfig,
            isItemModalOpen: false,
            item: {
                id: null
            }
        });
    };

    const openFoodsModal = () => {

        setEntryConfig({
            ...entryConfig,
            isFoodsModalOpen: true
        })
    };

    const openRecipesModal = () => {

        setEntryConfig({
            ...entryConfig,
            isRecipesModalOpen: true
        })
    };

    const closeFoodsModal = () => {

        setEntryConfig({
            ...entryConfig,
            isFoodsModalOpen: false
        })
    };

    const closeRecipesModal = () => {

        setEntryConfig({
            ...entryConfig,
            isRecipesModalOpen: false
        })
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
                                    <button onClick={openFoodsModal}>Foods</button>
                                    <button onClick={openRecipesModal}>Recipes</button>
                                </td>
                                <td>
                                    <button onClick={() => openEditEntryModal(entry.id)}>Edit</button>
                                    <button onClick={() => openDeleteEntryModal(entry.id, entry.time)}>Delete</button>
                                </td>
                                <ReactModal
                                    isOpen={modalConfig.isItemModalOpen}
                                    onRequestClose={closeEditEntryModal}
                                >
                                    <Entry
                                        entry={entry}
                                        setEditingJournal={setEditingJournal}
                                        onClose={closeEditEntryModal}
                                    />
                                </ReactModal>
                                <ReactModal
                                    isOpen={modalConfig.isDeleteItemModalOpen}
                                    onRequestClose={closeDeleteEntryModal}
                                >
                                    <ConfirmDelete
                                        name={`entry for ${modalConfig.item.name}`}
                                        onConfirm={handleDelete}
                                        onCancel={closeDeleteEntryModal}
                                    />
                                </ReactModal>
                                <ReactModal
                                    isOpen={entryConfig.isFoodsModalOpen}
                                    onRequestClose={closeFoodsModal}
                                >
                                    <Foods
                                        journalFoods={entry.journalFoods}
                                        onClose={closeFoodsModal}
                                    />
                                </ReactModal>
                                <ReactModal
                                    isOpen={entryConfig.isRecipesModalOpen}
                                    onRequestClose={closeRecipesModal}
                                >
                                    <Recipes
                                        journalRecipes={entry.journalRecipes}
                                        onClose={closeRecipesModal}
                                    />
                                </ReactModal>
                            </tr>
                    )})}
                </tbody>
            </table>
        </div>
    );
}

function Entry({ entry, setEditingJournal, onClose }) {

    const { insulinTypes } = useSelector((state) => state.journals);
    const [ entryConfig, setEntryConfig ] = useState({
        isFoodsModalOpen: false,
        isRecipesModalOpen: false
    });

    const openFoodsModal = () => {

        setEntryConfig({
            ...entryConfig,
            isFoodsModalOpen: true
        })
    };

    const openRecipesModal = () => {

        setEntryConfig({
            ...entryConfig,
            isRecipesModalOpen: true
        })
    };

    const closeFoodsModal = () => {

        setEntryConfig({
            ...entryConfig,
            isFoodsModalOpen: false
        })
    };

    const closeRecipesModal = () => {

        setEntryConfig({
            ...entryConfig,
            isRecipesModalOpen: false
        })
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

    return (
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
                    isOpen={entryConfig.isItemModalOpen}
                    onRequestClose={closeFoodsModal}
                >
                    <Foods
                        journalFoods={entry.journalFoods}
                        onClose={closeFoodsModal}
                    />
                </ReactModal>

                <ReactModal
                    isOpen={entryConfig.isItemModalOpen}
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

function Foods({ journalFoods, onClose }) {

    const dispatch = useDispatch();
    const { items: foods } = useSelector((state) => state.foods);

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

    const handleSave = () => {
        onClose();
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <div>
            <h3>Foods in this entry</h3>
            {journalFoods && getTotalProperties(journalFoods)}
            <ol>
                {journalFoods && journalFoods.map((journalFood, index) => (
                    <div style={{display: "flex"}}>
                        <li key={index}>{journalFood.quantity}g of {journalFood.food.name}</li>
                        <button>Edit</button>
                        <button>Delete</button>
                    </div>
                ))}
            </ol>
            <input placeholder="Enter quantity (g)"/> of
            <select>
                <option>Select Food</option>
                {foods && foods.map(food => (
                    <option key={food.id} value={food}>{food.name}</option>
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

function Recipes({ journalRecipes, onClose }) {

    const dispatch = useDispatch();
    const { items: recipes } = useSelector((state) => state.recipes);

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
                    <div style={{ display: "flex" }}>
                        <li key={index}>{journalRecipe.quantity}g of {journalRecipe.recipe.name}</li>
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