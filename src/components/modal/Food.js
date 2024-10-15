import { useSelector } from "react-redux";

function Food({ onClose }) {
    const { selectedItem, itemTypes } = useSelector((state) => state.foods);

    return (
        <div>
            <h2>Edit Food</h2>
            {selectedItem ? (
                <div className="modal-form">
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={selectedItem.name}
                        />
                    </label>
                    <label>
                        Carbs per 100g:
                        <input
                            type="text"
                            name="carbs"
                            placeholder="Carbs per 100g"
                            value={selectedItem.carbs}
                        />
                    </label>
                    <label>
                        Calories per 100g:
                        <input
                            type="text"
                            name="calories"
                            placeholder="Calories per 100g"
                            value={selectedItem.calories}
                        />
                    </label>
                    <label>
                        Type:
                        <select name="type" value={selectedItem.type}>
                            <option value="">Select Type</option>
                            {itemTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Comments:
                        <input
                            type="text"
                            name="comments"
                            placeholder="Comments"
                            value={selectedItem.comments}
                        />
                    </label>
                    <div className="modal-buttons">
                        <button>Save</button>
                        <button onClick={onClose}>Close</button>
                    </div>
                </div>
            ) : (
                <p>Loading...</p> // Handle case where food data is still being fetched
            )}
        </div>
    );
}

export default Food;
