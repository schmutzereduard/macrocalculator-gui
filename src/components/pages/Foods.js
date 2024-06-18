import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { fetchFoods, fetchFoodTypes } from '../../store/actions/foodActions';
import { showInsertFoodModal, hideInsertFoodModal } from '../../store/actions/modal/insert';
import { showEditFoodModal, hideEditFoodModal } from '../../store/actions/modal/edit';
import { showDeleteFoodModal, hideDeleteFoodModal } from '../../store/actions/modal/delete';
import InsertFoodModal from '../modal/InsertFoodModal';
import EditFoodModal from '../modal/EditFoodModal';
import DeleteFoodModal from '../modal/DeleteFoodModal';

const Foods = ({
    onAddFood, onCancelAddFood,
    onEditFood, onCancelEditFood,
    onDeleteFood, onCancelDeleteFood
}) => {

    const dispatch = useDispatch();
    const foods = useSelector(state => state.foods.foods);
    const loading = useSelector(state => state.foods.loading);
    const isInsertFoodModalOpen = useSelector(state => state.insertModal.isInsertFoodModalOpen);
    const isEditFoodModalOpen = useSelector(state => state.editModal.isEditFoodModalOpen);
    const isDeleteFoodModalOpen = useSelector(state => state.deleteModal.isDeleteFoodModalOpen);

    const [search, setSearch] = useState('');
    const [editingFood, setEditingFood] = useState(null);
    const [deletingFood, setDeletingFood] = useState(null);

    useEffect(() => {
        dispatch(fetchFoods());
        dispatch(fetchFoodTypes());
    }, [dispatch]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const filteredFoods = foods.filter(food => food.name.toLowerCase().includes(search.toLowerCase()));

    const handleAddFood = () => {
        onAddFood();
    };

    const handleDeleteFood = (id) => {
        setDeletingFood(id);
        onDeleteFood();
    };

    const handleEditFood = (food) => {
        setEditingFood(food);
        onEditFood();
    };

    return (
        <div>
            <div className="food-header">
                <input
                    type="text"
                    placeholder="Search for foods..."
                    value={search}
                    onChange={handleSearchChange}
                />
                <button onClick={handleAddFood}>Add Food</button>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Carbs</th>
                            <th>Calories</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFoods.map(food => (
                            <tr key={food.id}>
                                <td>{food.name}</td>
                                <td>{food.carbs}</td>
                                <td>{food.calories}</td>
                                <td>{food.type}</td>
                                <td>
                                    <button onClick={() => handleEditFood(food)}>Edit</button>
                                    <button onClick={() => handleDeleteFood(food.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <InsertFoodModal 
                isOpen={isInsertFoodModalOpen} 
                onRequestClose={onCancelAddFood} 
            />
            <EditFoodModal 
                isOpen={isEditFoodModalOpen} 
                onRequestClose={onCancelEditFood} 
                food={editingFood}
            />
            <DeleteFoodModal 
                isOpen={isDeleteFoodModalOpen} 
                onRequestClose={onCancelDeleteFood} 
                foodId={deletingFood}
            />
        </div>
    );
};

const mapDispatchToProps = (dispatch) => ({
    onAddFood: () => dispatch(showInsertFoodModal()),
    onCancelAddFood: () => dispatch(hideInsertFoodModal()),
    onEditFood: () => dispatch(showEditFoodModal()),
    onCancelEditFood: () => dispatch(hideEditFoodModal()),
    onDeleteFood: () => dispatch(showDeleteFoodModal()),
    onCancelDeleteFood: () => dispatch(hideDeleteFoodModal())
});

export default connect(null, mapDispatchToProps)(Foods);
