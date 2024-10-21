import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactModal from 'react-modal';
import { addJournal, updateJournal, deleteJournal } from '../../features/journalsSlice';
import ConfirmDelete from '../modal/ConfirmDelete';
import SaveChanges from '../modal/SaveChanges';
import Loading from '../misc/Loading';

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
                        <Entries editingJournal={editingJournal} setEditingJournal={setEditingJournal}/>
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

    const [newEntry, setNewEntry] = useState({
        time: '',
        bloodSugarLevel: '',
        recipes: [],
        foods: [],
        insulinUnits: '',
        insulinType: ''
    });

    const handleAddEntry = () => {
        setEditingJournal((prev) => ({
            ...prev,
            entries: [...(prev.entries || []), newEntry]
        }));
        setNewEntry({ time: '', bloodSugarLevel: '', recipes: [], foods: [], insulinUnits: '', insulinType: '' });
    };

    const handleDeleteEntry = (index) => {
        setEditingJournal((prev) => ({
            ...prev,
            entries: prev.entries.filter((_, i) => i !== index)
        }));
    };


    return (
        <div>
            <h3>Entries</h3>
            <button onClick={handleAddEntry}>Add Entry</button>
            <table>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Blood Sugar</th>
                        <th>Insulin (units)</th>
                        <th>Insulin (type)</th>
                        <th>Intake (Food / Meals)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {editingJournal && editingJournal.entries.map((entry) => (
                    <tr key={entry.id}>
                        <td>{entry.time}</td>
                        <td>{entry.bloodSugarBefore}</td>
                        <td>{entry.insulinCorrection}</td>
                        <td>{entry.insulinType}</td>
                        <td>
                            Recipes: {entry.journalRecipes.map((recipe => <span key={recipe.id}>{recipe.quantity}g of {recipe.recipe.name}, </span>))}
                            Foods: {entry.journalFoods.map((food) => <span key={food.id}>{food.quantity}g of {food.food.name}, </span>)}
                        </td>
                        <td>
                            <button>Edit</button>
                            <button onClick={() => handleDeleteEntry(entry.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Journal;