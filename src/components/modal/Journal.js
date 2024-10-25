import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactModal from 'react-modal';
import { addJournal, updateJournal, deleteJournal, fetchInsulinTypes } from '../../features/journalsSlice';
import ConfirmDelete from '../modal/ConfirmDelete';
import SaveChanges from '../modal/SaveChanges';
import Loading from '../misc/Loading';
import { fetchFoods } from '../../features/foodsSlice';
import { fetchRecipes } from '../../features/recipesSlice';

function Journal({ onClose }) {
    const dispatch = useDispatch();
    const { selectedItem: journal, loading } = useSelector(state => state.journals);

    const [editingJournal, setEditingJournal] = useState(null);
    const [isSaveChangesModalOpen, setSaveChangesModalOpen] = useState(false);
    const [isDeleteJournalModalOpen, setDeleteJournalModalOpen] = useState(false);

    useEffect(() => {
        if (journal) {
            setEditingJournal({ ...journal });
        }
    }, [journal]);

    const journalChanged = () => {
        for (let key in editingJournal) {
            if (editingJournal[key] !== journal[key]) return true;
        }
        return false;
    };

    const handleSaveChanges = () => {
        if (journal.id) {
            dispatch(updateJournal(editingJournal));
        } else {
            dispatch(addJournal(editingJournal));
        }
        setSaveChangesModalOpen(false);
        onClose();
    };

    const handleModalClose = () => {
        if (journalChanged()) {
            setSaveChangesModalOpen(true);
        } else {
            onClose();
        }
    };

    const confirmDeleteJournal = () => {
        dispatch(deleteJournal(editingJournal.id));
        setDeleteJournalModalOpen(false);
        onClose();
    };

    return (
        <div>
            {loading ? <Loading /> : (
                <div>
                    <div className="modal-form">
                        <h2>Journal for {editingJournal ? editingJournal.date : ''}</h2>
                        <textarea
                            value={editingJournal?.notes || ''}
                            onChange={(e) => {
                                setEditingJournal({ ...editingJournal, notes: e.target.value });
                            }}
                            rows="4"
                            placeholder="Notes"
                        />
                        <div className="header">
                            <AddEntry editingJournal={editingJournal} setEditingJournal={setEditingJournal}/>
                        </div>
                        <Entries editingJournal={editingJournal} setEditingJournal={setEditingJournal} />
                    </div>

                    <div className="modal-buttons">
                        <div>
                            <button onClick={handleSaveChanges}>Save</button>
                            <button onClick={handleModalClose}>Close</button>
                        </div>
                    </div>

                    <ReactModal isOpen={isSaveChangesModalOpen} onRequestClose={() => setSaveChangesModalOpen(false)}>
                        <SaveChanges onSave={handleSaveChanges} onExit={onClose} />
                    </ReactModal>

                    <ReactModal isOpen={isDeleteJournalModalOpen} onRequestClose={() => setDeleteJournalModalOpen(false)}>
                        <ConfirmDelete
                            name={editingJournal?.date}
                            onConfirm={confirmDeleteJournal}
                            onCancel={() => setDeleteJournalModalOpen(false)}
                        />
                    </ReactModal>
                </div>
            )}
        </div>
    );
}

function Entries({ editingJournal, setEditingJournal }) {

    const [isFoodsModalOpen, setFoodsModalOpen] = useState(false);
    const [isRecipesModalOpen, setRecipesModalOpen] = useState(false);
    const [isDeleteEntryModalOpen, setDeleteEntryModalOpen] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState(null);

    const openDeleteEntryModal = (index) => {
        setEntryToDelete(index);
        setDeleteEntryModalOpen(true);
    };

    const confirmDeleteEntryModal = () => {
        if (entryToDelete !== null) {
            setEditingJournal((prev) => ({
                ...prev,
                entries: prev.entries.filter((entry) => entry.id !== entryToDelete),
            }));
            setEntryToDelete(null);
            setDeleteEntryModalOpen(false);
        }
    };


    const handleEditEntry = () => {

    }

    const closeDeleteEntryModal = () => {
        setDeleteEntryModalOpen(false);
    }

    const closeFoodsModal = () => {
        setFoodsModalOpen(false);
    }

    const closeRecipesModal = () => {
        setRecipesModalOpen(false);
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
                    {editingJournal && editingJournal.entries.map((entry) => (
                        <tr key={entry.id}>
                            <td>{new Date(entry.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                            <td>{entry.bloodSugarLevel}</td>
                            <td>{entry.insulinUnits}</td>
                            <td>{entry.insulinType}</td>
                            <td>
                                <p>Carbs: {entry.totalCarbs}, Calories: {entry.totalCalories}</p>
                                <button onClick={() => setFoodsModalOpen(true)}>Foods</button>
                                <button onClick={() => setRecipesModalOpen(true)}>Recipes</button>
                            </td>
                            <td>
                                <button onClick={handleEditEntry}>Edit</button>
                                <button onClick={() => openDeleteEntryModal(entry.id)}>Delete</button>
                            </td>
                            <ReactModal isOpen={isDeleteEntryModalOpen} onRequestClose={closeDeleteEntryModal}>
                                <ConfirmDelete
                                    name="this entry"
                                    onConfirm={confirmDeleteEntryModal}
                                    onCancel={closeDeleteEntryModal}
                                />
                            </ReactModal>
                            <ReactModal isOpen={isFoodsModalOpen} onRequestClose={closeFoodsModal}>
                                <Foods
                                    journalFoods={entry.journalFoods}
                                    onClose={closeFoodsModal}
                                />
                            </ReactModal>
                            <ReactModal isOpen={isRecipesModalOpen} onRequestClose={closeRecipesModal}>
                                <Recipes
                                    journalRecipes={entry.journalRecipes}
                                    onClose={closeRecipesModal}
                                />
                            </ReactModal>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function AddEntry({ editingJournal, setEditingJournal }) {

    const dispatch = useDispatch();
    const { insulinTypes } = useSelector((state) => state.journals);
    const [newEntry, setNewEntry] = useState({
        time: '',
        bloodSugarLevel: '',
        recipes: [],
        foods: [],
        insulinUnits: '',
        insulinType: ''
    });

    useEffect(() => {
        if (insulinTypes.length === 0) {
            dispatch(fetchInsulinTypes());
        }
    }, [dispatch, insulinTypes.length]);

    const handleAddEntry = () => {
        if (newEntry.time && newEntry.bloodSugarLevel && newEntry.insulinUnits && newEntry.insulinType) {
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
        }
    };

    const handleInputChange = (property, event) => {
        setNewEntry((prev) => ({
            ...prev,
            [property]: event.target.value,
        }));
    };

    return (
        <div className="add-journal-entry-form">
            <input
                value={newEntry.time}
                onChange={(e) => handleInputChange("time", e)}
                type="time"
                placeholder="Time"
            />
            <input
                value={newEntry.bloodSugarLevel}
                onChange={(e) => handleInputChange("bloodSugarLevel", e)}
                type="number"
                placeholder="Blood Sugar Level"
            />
            <input
                value={newEntry.insulinUnits}
                onChange={(e) => handleInputChange("insulinUnits", e)}
                type="number"
                placeholder="Insulin Units"
            />
            <select
                name="type"
                value={newEntry.insulinType}
                onChange={(e) => handleInputChange("insulinType", e)}
            >
                <option value="">Select Insulin Type</option>
                {insulinTypes.map((type) => (
                    <option key={type} value={type}>
                        {type}
                    </option>
                ))}
            </select>

            <button onClick={handleAddEntry}>Add Entry</button>
        </div>
    );
}

function Foods({ journalFoods, onClose }) {

    const dispatch = useDispatch();
    const {items: foods} = useSelector((state) => state.foods);

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
                    <div style={{ display: "flex" }}>
                        <li key={index}>{journalFood.quantity}g of {journalFood.food.name}</li>
                        <button>Edit</button>
                        <button>Delete</button>
                    </div>
                ))}
            </ol>
            <input placeholder="Enter quantity (g)" /> of
            <select>
                <option>Select Food</option>
                {foods && foods.map(food => (
                    <option value={food}>{food.name}</option>
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